import { Component, OnInit } from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {PaginationService, PaginatePipe} from "ng2-pagination/index";
import { LogFilterPipe } from './pipes/log-filter.pipe';
import { PaginationComponent } from '../../global/components/pagination/pagination.component';
import { ActionLog, QueryParam, User } from '../client/client.model';
import { SearchComponent } from '../../global/components/searchbox/seach-box.component';
import { UserSearchPipe } from '../../global/pipes/user-search.pipe';
import { Datepicker } from '../../global/components/datepicker/datepicker.component';
import { NSFOService } from '../../global/services/nsfo/nsfo.service';
import { SettingsService } from '../../global/services/settings/settings.service';
import { END_DATE, START_DATE, USER_ACCOUNT_ID, USER_ACTION_TYPE } from '../../global/constants/query-params.constant';
import { SERVER_ERROR_MESSAGE } from '../../global/constants/messages.constant';
import { REACTIVE_FORM_DIRECTIVES, Validators } from '@angular/forms';
import { Control, ControlGroup, FormBuilder, LowerCasePipe, UpperCasePipe } from '@angular/common';
import { LoginEnvironmentPipe } from './pipes/login-environment.pipe';
import { CheckMarkComponent } from '../../global/components/checkmark/check-mark.component';
import { SortOrder, SortService } from '../../global/services/utils/sort.service';
import { SortSwitchComponent } from '../../global/components/sortswitch/sort-switch.component';
import { ADMIN, USER, VWA } from '../../global/constants/login-environments.contant';
import { DateTimeService } from '../../global/services/utils/date-time.service';
import { FormUtilService } from '../../global/services/utils/form-util.service';
import { UtilsService } from '../../global/services/utils/utils.service';
import { UcFirstPipe } from '../../global/pipes/uc-first.pipe';
import { TranslateUserActionTypeSortPipe } from './pipes/translate-user-action-type-sort.pipe';

declare var $;

@Component({
    providers: [PaginationService, SortService, DateTimeService, FormUtilService],
    directives: [REACTIVE_FORM_DIRECTIVES, ROUTER_DIRECTIVES, PaginationComponent, SearchComponent, Datepicker, CheckMarkComponent, SortSwitchComponent],
    template: require('./technical-log-overview.component.html'),
    pipes: [TranslatePipe, LogFilterPipe, PaginatePipe, UserSearchPipe, LoginEnvironmentPipe, UpperCasePipe, LowerCasePipe, UcFirstPipe, TranslateUserActionTypeSortPipe ]
})
export class TechnicalLogOverviewComponent {
    private isUsersLoaded: boolean = false;
    private isLogsLoaded: boolean = true; // only false during the getLogs call
	  private isLogTypeSelected: boolean = false;
	  private includeAllUsers: boolean = false;
	  private savingInProgress: boolean = false; // used by DatePicker

	  private maxMonthsPeriod: number = 12;

    private userList: User[] = [];
	  private logTypesList: string[] = [];
	  private logTypesFilterList: string[] = [];
	  private actionLogs: ActionLog[] = [];

		private selectedUser: User;
		private selectedUserActionType: string;
		private selectedStartDate: string;
		private selectedEndDate: string;

    private filterSearch: string;
    private filterIsCompleted: boolean;
    private filterLoginEnvironment: string;
    private filterIsRvoMessage: boolean;
    private filterUserActionTypes: string;

    private filterAmount: number = 10;

    private filterAmountOptions = [10, 25, 50];
    private filterIsCompletedOptions = [undefined, true, false];
    private filterIsRvoMessageOptions = [undefined, true, false];
    private filterLoginEnvironmentOptions: string[] = [undefined, ADMIN, USER, VWA];

    private isDateSortAscending: boolean;

    private userDropDownSearchTerm: string;
		private showAccountSelect: boolean = false;

		private dateForm: ControlGroup;
		private errors: string[] = [];

    constructor(private nsfo: NSFOService, private formBuilder: FormBuilder,
								private settings: SettingsService, private sortService: SortService,
								private dateTimeService: DateTimeService, private formUtilService: FormUtilService) {

    		this.resetFilterOptions();
    		this.resetForm();

				this.dateForm = this.formBuilder.group({
					startDate: [this.selectedStartDate, Validators.required],
					endDate: [this.selectedEndDate, Validators.required],
					selectedUserActionType: [this.selectedUserActionType, Validators.required],
				});

    		this.getUserList();
    }

    resetForm() {
			this.selectedUserActionType = 'ALL';
			this.selectedStartDate = this.settings.convertToViewDate(new Date());
			this.selectedEndDate = this.settings.convertToViewDate(new Date());

				if (this.dateForm) {
						this.resetErrors();
						this.setFormValue('startDate',this.selectedStartDate);
						this.setFormValue('endDate',this.selectedEndDate);
						this.setFormValue('selectedUserActionType',this.selectedUserActionType);
				}
		}

    private getUserList() {
        this.nsfo.doGetRequest(this.nsfo.URI_TECHNICAL_LOG + '-account-owners')
            .subscribe(
                res => {
                    this.userList = <User[]> res.result;
                    this.isUsersLoaded = true;
                },
								res => {
                	alert(SERVER_ERROR_MESSAGE);
								}
            );
    }

    private getLogTypes() {
        const queryParam = this.selectedUser !== null ? '?' + USER_ACCOUNT_ID + '=' + this.selectedUser.person_id : '';

        this.nsfo.doGetRequest(this.nsfo.URI_TECHNICAL_LOG + '-types' + queryParam)
            .subscribe(
                res => {
                    this.logTypesList = <string[]> res.result;
                    this.logTypesFilterList = this.logTypesList.slice();
                    this.isLogTypeSelected = true;
                }
            );
    }

		onSubmit() {

				this.selectedUserActionType = this.dateForm.value.selectedUserActionType;
				const startDate = new Date(this.dateForm.value.startDate);
				const endDate = new Date(this.dateForm.value.endDate);

				this.selectedStartDate = this.dateTimeService.getDateString(startDate);
				this.selectedEndDate = this.dateTimeService.getDateString(endDate);

				this.validateFormInput();

				if (this.errors.length === 0) {
					this.getLogs();
				}
		}

		getLogs() {
    		let queryParams: QueryParam[] = [
						{ key: START_DATE, value: this.selectedStartDate },
						{ key: END_DATE, value: this.selectedEndDate },
				];

    		if (this.selectedUserActionType !== 'ALL' && this.selectedUserActionType != null) {
    				queryParams.push({ key: USER_ACTION_TYPE, value: this.selectedUserActionType },)
				}

				if (this.selectedUser !== null) {
					queryParams.push({ key: USER_ACCOUNT_ID, value: this.selectedUser.person_id },)
				}

    		const queryParamsString = this.nsfo.parseQueryParamsString(queryParams);

    		// Reset values right before call
    		this.isLogsLoaded = false;

				this.nsfo.doGetRequest(this.nsfo.URI_TECHNICAL_LOG + queryParamsString)
						.subscribe(
								res => {
									this.actionLogs = <ActionLog[]> res.result;
									this.isDateSortAscending = false;
									this.sortByDate();
									this.resetFilterOptions();
									this.isLogsLoaded = true;
								},
								error => {
									alert("Iets is mis gegaan. Probeer minder logs per keer op te halen.");
									this.isLogsLoaded = true;
								}
						);
		}

		validateFormInput() {
    		this.resetErrors();
				this.validateDateInterval();
				this.validateChronological();
		}

		resetErrors() {
				this.errors = [];
				this.setErrors(null, 'startDate');
				this.setErrors(null, 'endDate');
				this.setErrors(null);
		}

		validateDateInterval() {
    		if (this.selectedUser !== null) { return; }

				const absoluteMonthsInterval = Math.abs(this.dateTimeService.getApproxDateStringIntervalInMonths(
					this.selectedStartDate, this.selectedEndDate));

				if (Math.floor(absoluteMonthsInterval) > this.maxMonthsPeriod) {

					const error = {'maxDateIntervalExceeded': true};
					this.addSubErrorsToForm('startDate', error);
					this.addSubErrorsToForm('endDate', error);
					this.addTotalErrorsToForm(error);

					this.errors.push('Het maximale tijdsinterval is ' + this.maxMonthsPeriod + ' maanden wanneer alle gebruikers zijn geselecteerd');
				}
		}

		validateChronological() {
    		const intervalInDays = this.dateTimeService.getDateStringIntervalInDays(
    			this.selectedStartDate, this.selectedEndDate);

				if (intervalInDays < 0) {
						const error = {'antiChronologicalDates': true};
						this.addSubErrorsToForm('startDate', error);
						this.addSubErrorsToForm('endDate', error);
						this.addTotalErrorsToForm(error);

						this.errors.push('Startdatum mag niet groter zijn dan de einddatum');
				}
		}

		addSubErrorsToForm(controlKey: string, error: any) {
				const currentErrors = this.dateForm.controls[controlKey].errors;
				const newErrors = this.formUtilService.mergeErrors(currentErrors, error);
				this.setErrors(newErrors, controlKey);
		}

		addTotalErrorsToForm(error: any) {
				const currentErrors = this.dateForm.errors;
				const newErrors = this.formUtilService.mergeErrors(currentErrors, error);
				this.setErrors(newErrors);
		}

		setErrors(errors: any, controlKey ?: string) {
    		if (controlKey == null) {
						(<ControlGroup>this.dateForm).setErrors(errors);
				} else {
					(<Control>this.dateForm.controls[controlKey]).setErrors(errors);
				}
		}

		setFormValue(controlKey: string, value: string) {
				(<Control>this.dateForm.controls[controlKey]).updateValue(value);
		}

    getFilterOptions(): any[] {
    		return [
						this.filterSearch,
						this.filterIsCompleted,
						this.filterLoginEnvironment,
						this.filterIsRvoMessage,
						this.filterUserActionTypes,
				];
		}

		resetFilterOptions() {
				this.filterSearch = '';
				this.filterIsCompleted = undefined;
				this.filterLoginEnvironment = undefined;
				this.filterIsRvoMessage = undefined;
				this.filterUserActionTypes = 'ALL';
		}

		getFullName(user: User) {
    		let fullName = '';
    		if (user) {
						if (user.first_name) {
								fullName = fullName + user.first_name;
						}

						if (user.first_name && user.last_name) {
								fullName = fullName + ' ';
						}

						if (user.last_name) {
							fullName = fullName + user.last_name;
						}
				}
				return fullName;
		}


		onSelectUserClick(user: User) {
    	if (this.errors.length > 0) {
					this.resetForm();
			}
    	this.selectedUser = user;
    	this.showAccountSelect = false;
    	this.includeAllUsers = false;
			this.getLogTypes();
		}

		onIncludeAllUsersClick() {
    	this.selectedUser = null;
			this.showAccountSelect = false;
    	this.includeAllUsers = true;
			this.getLogTypes();
		}

		getSelectedUserDisplay() {
			if (this.includeAllUsers) {
						return 'ALL USERS SELECTED';
				} else if (this.selectedUser != null) {
						return this.getFullName(this.selectedUser);
				}
    		return 'NO USER OPTION SELECTED YET'
		}

		getSelectedUserDisplayPrefix() {
    		if (!this.getUserSelectionWasDone()) {
    				return '';
				}
				return 'USER SELECTION: ';
		}

		getUserSelectionWasDone() {
    	return this.includeAllUsers || this.selectedUser != null;
		}

		getBoolDrowDownText(string: string|boolean): string {
    		return this.formUtilService.getBoolDrowDownText(string);
		}

		getPersonType(user: User): string {
    		return UtilsService.getPersonType(user);
		}

		getMaxMonthsPeriod(): number {
    	return this.maxMonthsPeriod;
		}

		onSortByDateToggle() {
			//toggle sort direction
			this.isDateSortAscending = !this.isDateSortAscending;
    	this.sortByDate();
		}

		sortByDate() {
			const sortOrder = new SortOrder();
			sortOrder.variableName = 'log_date';
			sortOrder.isDate = false; //it is a dateString
			sortOrder.ascending = this.isDateSortAscending;

			this.actionLogs = this.sortService.sort(this.actionLogs, [sortOrder]);
		}
}

