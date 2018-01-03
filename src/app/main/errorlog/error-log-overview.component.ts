import { Component, OnDestroy, OnInit } from '@angular/core';
import { SortService } from '../../global/services/utils/sort.service';
import { PaginationComponent } from '../../global/components/pagination/pagination.component';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { CheckMarkComponent } from '../../global/components/checkmark/check-mark.component';
import { PaginatePipe, PaginationService } from 'ng2-pagination';
import { UserSearchPipe } from '../../global/pipes/user-search.pipe';
import { FormUtilService } from '../../global/services/utils/form-util.service';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { SortSwitchComponent } from '../../global/components/sortswitch/sort-switch.component';
import { SearchComponent } from '../../global/components/searchbox/seach-box.component';
import { Datepicker } from '../../global/components/datepicker/datepicker.component';
import { DateTimeService } from '../../global/services/utils/date-time.service';
import { TranslatePipe } from 'ng2-translate';
import { ErrorLogFilterPipe } from './pipes/error-log-filter.pipe';
import { SettingsService } from '../../global/services/settings/settings.service';
import { NSFOService } from '../../global/services/nsfo/nsfo.service';
import { FormBuilder } from '@angular/common';
import { FORMAL, SHOW_HIDDEN } from '../../global/constants/query-params.constant';
import { ErrorMessage } from './models/error-message.model';
import { HideError } from './models/hide-error.model';

import _ = require("lodash");
import { DeclareName } from './models/declare-names.model';
import { HideErrorsUpdateResult } from './models/hide-errors-update-result.model';
import { Response } from '@angular/http/src/static_response';

@Component({
		providers: [PaginationService, SortService, DateTimeService, FormUtilService, ErrorLogFilterPipe],
		directives: [REACTIVE_FORM_DIRECTIVES, ROUTER_DIRECTIVES, PaginationComponent, SearchComponent, Datepicker, CheckMarkComponent, SortSwitchComponent],
		template: require('./error-log-overview.component.html'),
		pipes: [TranslatePipe, ErrorLogFilterPipe, PaginatePipe, UserSearchPipe]
})
export class ErrorLogOverviewComponent implements OnInit, OnDestroy {

		private isErrorsLoaded = false;
		private isInformalNamesLoaded = false;
		private isUpdatingHiddenStatus = false;

		public errors: ErrorMessage[];
		private declareType = 'informal';
		private declareNames: DeclareName[] = [];
		private declareTypesForDropdown;

		private filterAmount: number = 10;
		private filterAmountOptions = [10, 25, 50];
		private filterIsHiddenForAdminOptions = [undefined, true, false];

		private filterLogDateStart: string;
		private filterLogDateEnd: string;
		private filterEventDateStart: string;
		private filterEventDateEnd: string;
		private filterSearch: string; // Search in action_by and declare_info
		private filterIsHiddenForAdmin: boolean;
		private filterUbn: string; // filter in ubn and related_ubn
		private filterRelatedUbn: string; // filter in ubn and related_ubn
		private filterType: string;
		private filterActionByType: string;

		constructor(private nsfo: NSFOService, private formBuilder: FormBuilder,
								private settings: SettingsService, private sortService: SortService,
								private dateTimeService: DateTimeService, private formUtilService: FormUtilService,
								private errorLogFilterService: ErrorLogFilterPipe
		) {
				this.resetFilterOptions();
		}

		public ngOnInit() {
				this.filterType = null;
				this.filterIsHiddenForAdmin = false;
				this.getErrors();
				this.doGetDeclareTypesRequest(true);
				this.doGetDeclareTypesRequest(false);
		}


		ngOnDestroy() {
				this.errors = [];
				this.declareNames = [];
		}


		public isDataLoaded(): boolean {
				return this.isErrorsLoaded && this.isInformalNamesLoaded;
		}


		private getErrors(includeHiddenForAdmin: boolean = false) {
				const queryParam = includeHiddenForAdmin ? '?'+SHOW_HIDDEN+'=true' : '';

				this.nsfo.doGetRequest(this.nsfo.URI_ERRORS + queryParam)
						.subscribe(
						res => {
							this.errors = <ErrorMessage[]> res.result;
							this.isErrorsLoaded = true;
						},
						error => {
								alert(this.nsfo.getErrorMessage(error));
						}
				);
		}


		public getDeclareTypes() {
				if (!this.declareTypesForDropdown) {
						this.declareTypesForDropdown = _.map(this.declareNames, this.declareType);
						this.declareTypesForDropdown = this.declareTypesForDropdown.sort();
						this.declareTypesForDropdown.unshift(null);
				}

				return this.declareTypesForDropdown;
		}


		private doGetDeclareTypesRequest(useFormalDeclareNames: boolean) {
			const queryParam = '?'+FORMAL+'=' + (useFormalDeclareNames ? 'true' : 'false');

			this.nsfo.doGetRequest(this.nsfo.URI_ERRORS_DECLARE_TYPES + queryParam)
				.subscribe(
					res => {
						for(let key in res.result) {
							const value = res.result[key];

							const index = _.findIndex(this.declareNames, {key: key});
							if (index === -1) {
									let declareName = new DeclareName();
									declareName.key = key;

									if (useFormalDeclareNames) {
											declareName.formal = value;
									} else {
											declareName.informal = value;
									}

									this.declareNames.push(declareName)

							} else {
									let declareName = _.find(this.declareNames, {key: key});

									if (useFormalDeclareNames) {
											declareName.formal = value;
									} else {
											declareName.informal = value;
									}

									this.declareNames.splice(index, 1, declareName);
							}

						}

						if (!useFormalDeclareNames) {
								this.isInformalNamesLoaded = true;
						}

					},
					error => {
						alert(this.nsfo.getErrorMessage(error));
					}
				);
		}


		hideShownErrorsForAdmin() {
				const errorMessagesToHide = this.errorLogFilterService.transform(this.errors, this.getFilterOptions());
				// TODO built in modal double check
				this.hideErrorsForAdmin(errorMessagesToHide);
		}


		private hideErrorsForAdmin(errorMessages: ErrorMessage[]) {
				this.toggleErrorHideForAdminStatus(errorMessages, true);
		}


		private revealErrorsForAdmin(errorMessages: ErrorMessage[]) {
				this.toggleErrorHideForAdminStatus(errorMessages, false);
		}


		/**
		 * A DeclareBirth can be hidden from the admin in two ways.
		 * 1. DeclareBirth.hideForAdmin = true OR DeclareBirth.getLitter().hideForAdmin = true.
		 * To keep it simple, only the hideForAdmin state on the DeclareBirth will the toggled.
		 *
		 * @param {ErrorMessage} errorMessages with the new
		 * @param {boolean} hideForAdmin
		 */
		private toggleErrorHideForAdminStatus(errorMessages: ErrorMessage[], hideForAdmin: boolean) {

				let edits: HideError[] = [];

				for(let errorMessage of errorMessages) {

						// For now we only hide on IR level.
						// It is for example also possible to hide a whole litter, but we will keep it simple for now

						let errorToEdit = new HideError();
						errorToEdit.message_id = errorMessage.request_id;
						errorToEdit.is_ir_message = true;
						errorToEdit.hide_for_admin = hideForAdmin;

						edits.push(errorToEdit);
				}

				const body = {
					is_multi_edit: true,
					edits: edits
				};

				this.isUpdatingHiddenStatus = true;
				this.nsfo.doPutRequest(this.nsfo.URI_ERRORS_HIDDEN_STATUS, body)
						.subscribe(
						res => {
										this.updateErrorMessagesFromUpdateResponse(res);
								},
								error => {
										alert(this.nsfo.getErrorMessage(error));

										if (error.result.success_count > 0) {
												this.updateErrorMessagesFromUpdateResponse(error);
										}
								},
								() => {
										this.isUpdatingHiddenStatus = false;
								}
						);
		}


		private updateErrorMessagesFromUpdateResponse(response: HideErrorsUpdateResult) {
				const successfulEdits = response.result.successful_edits;

				for(let successfulEdit of successfulEdits) {

						let currentErrorMessage = _.find(this.errors, {request_id: successfulEdit.message_id});

						if (currentErrorMessage && currentErrorMessage.hide_for_admin !== successfulEdit.hide_for_admin) {
								const index = _.findIndex(this.errors, {request_id: successfulEdit.message_id});
								currentErrorMessage.hide_for_admin = successfulEdit.hide_for_admin;
								this.errors.splice(index, 1, currentErrorMessage);
						}
				}
		}


		private getActionByTypeOptions(): string[] {
				return [
						'CLIENT',
						'ADMIN',
						'SUPER_ADMIN',
						'DEVELOPER',
				];
		}


		private resetFilterOptions() {
				this.filterSearch = '';
				this.filterLogDateStart = '';
				this.filterLogDateEnd = '';
				this.filterEventDateStart = '';
				this.filterEventDateEnd = '';
				this.filterIsHiddenForAdmin = undefined;
				this.filterUbn = '';
				this.filterRelatedUbn = '';
				this.filterType = 'ALL';
				this.filterActionByType = 'ALL';
		}


		getFilterOptions(): any[] {
			return [
				this.filterSearch,
				this.filterLogDateStart,
				this.filterLogDateEnd,
				this.filterEventDateStart,
				this.filterEventDateEnd,
				this.filterIsHiddenForAdmin,
				this.filterUbn,
				this.filterRelatedUbn,
				this.filterType,
				this.filterActionByType,
			];
		}

		getBoolDrowDownText(string: string|boolean): string {
				return this.formUtilService.getBoolDrowDownText(string);
		}
}