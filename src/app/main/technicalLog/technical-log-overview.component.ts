import { Component, OnInit } from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {PaginationService, PaginatePipe} from "ng2-pagination/index";
import { LogFilterPipe } from './pipes/log-filter.pipe';
import { PaginationComponent } from '../../global/components/pagination/pagination.component';
import { ActionLog, QueryParam, User } from '../client/client.model';
import { SearchComponent } from '../../global/components/searchbox/seach-box.component';
import { SearchPipe } from '../../global/pipes/search.pipe';
import { Datepicker } from '../../global/components/datepicker/datepicker.component';
import { NSFOService } from '../../global/services/nsfo/nsfo.service';
import { SettingsService } from '../../global/services/settings/settings.service';
import { END_DATE, START_DATE, USER_ACCOUNT_ID, USER_ACTION_TYPE } from '../../global/constants/query-params.constant';
import { SERVER_ERROR_MESSAGE } from '../../global/constants/messages.constant';
import { REACTIVE_FORM_DIRECTIVES, Validators } from '@angular/forms';
import { ControlGroup, FormBuilder } from '@angular/common';
import { LoginEnvironmentPipe } from './pipes/login-environment.pipe';
import { CheckMarkComponent } from '../../global/components/checkmark/check-mark.component';
import { SortOrder, SortService } from '../../global/services/utils/sort.service';
import { SortSwitchComponent } from '../../global/components/sortswitch/sort-switch.component';

declare var $;

@Component({
    providers: [PaginationService, SortService],
    directives: [REACTIVE_FORM_DIRECTIVES, ROUTER_DIRECTIVES, PaginationComponent, SearchComponent, Datepicker, CheckMarkComponent, SortSwitchComponent],
    template: require('./technical-log-overview.component.html'),
    pipes: [TranslatePipe, LogFilterPipe, PaginatePipe, SearchPipe, LoginEnvironmentPipe]
})
export class TechnicalLogOverviewComponent {
    private isUsersLoaded: boolean = false;
    private isLogsLoaded: boolean = false;
	  private isLogTypeSelected: boolean = false;
	  private includeAllUsers: boolean = false;
	  private savingInProgress: boolean = false;

	  private maxMonthsPeriod: number = 3;

    private userList: User[] = [];
	  private logTypesList: string[] = [];
	  private logTypesFilterList: string[] = [];
	  private actionLogs: ActionLog[] = [];

		private selectedUser: User;
		private selectedUserActionType: string;
		private selectedStartDate: string;
		private selectedEndDate: string;

    private filterSearch: string = '';
    private filterIsCompleted: boolean;
    private filterIsUserEnvironment: boolean;
    private filterIsVwaEnvironment: boolean;
    private filterIsRvoMessage: boolean;
    private filterUserActionTypes: string = 'ALL';

    private filterAmount: number = 10;
    private filterAmountOptions = [10, 25, 50];

    private filterIsCompletedOptions = [undefined, true, false];

    private isDateSortAscending: boolean;

    private isLoadedFoundation: boolean;

    private searchTerm: string;
		private showAccountSelect: boolean = false;

		private dateForm: ControlGroup;

    constructor(private nsfo: NSFOService, private formBuilder: FormBuilder,
								private settings: SettingsService, private sortService: SortService) {

				this.selectedStartDate = this.settings.convertToViewDate(new Date());
				this.selectedEndDate = this.settings.convertToViewDate(new Date());

				this.dateForm = this.formBuilder.group({
					startDate: [this.selectedStartDate, Validators.required],
					endDate: [this.selectedEndDate, Validators.required],
					selectedUserActionType: [null, Validators.required],
				});

    		this.getUserList();
    }


    ngAfterViewChecked() {
        $(document).foundation();
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

		getLogs() {
    		let queryParams: QueryParam[] = [
						{ key: START_DATE, value: '2017-01-31' },
						{ key: END_DATE, value: '2017-10-31' },
				];

    		if (this.selectedUserActionType !== 'ALL' && this.selectedUserActionType != null) {
    				queryParams.push({ key: USER_ACTION_TYPE, value: this.selectedUserActionType },)
				}

				//FOR TESTING
				queryParams.push({ key: USER_ACCOUNT_ID, value: 'c1ea3948b10f7f2de07e92da5d4cea4d3b444577' },)

				// if (this.selectedUser !== null) {
				// 	queryParams.push({ key: USER_ACCOUNT_ID, value: this.selectedUser.person_id },)
				// }

    		const queryParamsString = this.nsfo.parseQueryParamsString(queryParams);

				this.nsfo.doGetRequest(this.nsfo.URI_TECHNICAL_LOG + queryParamsString)
						.subscribe(
								res => {
									this.actionLogs = <ActionLog[]> res.result;
									this.isDateSortAscending = false;
									this.sortByDate();
									this.isLogsLoaded = true;
								}
						);
		}

    getFilterOptions(): any[] {
    		return [
						this.filterSearch,
						this.filterIsCompleted,
						this.filterIsUserEnvironment,
						this.filterIsVwaEnvironment,
						this.filterIsRvoMessage,
						this.filterUserActionTypes,
				];
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
    	if (string === 'true' || string === true) {
    		return 'waar';
			}

			if (string === 'false' || string === false) {
				return 'onwaar';
			}

			return 'alles';
		}

		getPersonType(user: User): string {
    	switch(user.type) {
				case 'Client': return 'Gebruiker';
				case 'Employee': return 'Admin';
				case 'VwaEmployee ': return 'VWA-medewerker';
				case 'Inspector ': return 'Inspecteur';
				default: return user.type;
			}
		}

		onSubmit() {
    	console.log(this.dateForm);
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
			sortOrder.ascending = !this.isDateSortAscending; //to sort as dateString flip boolean

			this.actionLogs = this.sortService.sort(this.actionLogs, [sortOrder]);
			console.log(this.isDateSortAscending);
		}
}

