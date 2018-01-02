import { Component, OnInit } from '@angular/core';
import { SortService } from '../../global/services/utils/sort.service';
import { PaginationComponent } from '../../global/components/pagination/pagination.component';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { CheckMarkComponent } from '../../global/components/checkmark/check-mark.component';
import { PaginatePipe, PaginationService } from 'ng2-pagination';
import { UserSearchPipe } from '../../global/pipes/user-search.pipe';
import { FormUtilService } from '../../global/services/utils/form-util.service';
import { REACTIVE_FORM_DIRECTIVES, Validators } from '@angular/forms';
import { SortSwitchComponent } from '../../global/components/sortswitch/sort-switch.component';
import { SearchComponent } from '../../global/components/searchbox/seach-box.component';
import { Datepicker } from '../../global/components/datepicker/datepicker.component';
import { DateTimeService } from '../../global/services/utils/date-time.service';
import { TranslatePipe } from 'ng2-translate';
import { ErrorLogFilterPipe } from './pipes/error-log-filter.pipe';
import { SettingsService } from '../../global/services/settings/settings.service';
import { NSFOService } from '../../global/services/nsfo/nsfo.service';
import { ControlGroup, FormBuilder } from '@angular/common';
import { FORMAL, SHOW_HIDDEN } from '../../global/constants/query-params.constant';
import { ErrorMessage } from './models/error-message.model';
import { HideError } from './models/hide-error.model';
import { HideErrorResponse } from './models/hide-error-response.model';

import _ = require("lodash");
import { DeclareName } from './models/declare-names.model';

@Component({
		providers: [PaginationService, SortService, DateTimeService, FormUtilService],
		directives: [REACTIVE_FORM_DIRECTIVES, ROUTER_DIRECTIVES, PaginationComponent, SearchComponent, Datepicker, CheckMarkComponent, SortSwitchComponent],
		template: require('./error-log-overview.component.html'),
		pipes: [TranslatePipe, ErrorLogFilterPipe, PaginatePipe, UserSearchPipe]
})
export class ErrorLogOverviewComponent implements OnInit {

		private isErrorsLoaded = false;
		private isInformalNamesLoaded = false;
		private isUpdatingHiddenStatus = false;

		public errors: ErrorMessage[];
		private informalDeclareNames: DeclareName[] = [];

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
		private filterType: string;
		private filterActionByType: string;

		constructor(private nsfo: NSFOService, private formBuilder: FormBuilder,
								private settings: SettingsService, private sortService: SortService,
								private dateTimeService: DateTimeService, private formUtilService: FormUtilService
		) {
				this.resetFilterOptions();
		}

		public ngOnInit() {
				this.getErrors();
				this.doGetDeclareTypesRequest(true);
				this.doGetDeclareTypesRequest(false);
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
				return _.map(this.informalDeclareNames, 'informal');
		}


		private doGetDeclareTypesRequest(useFormalDeclareNames: boolean) {
			const queryParam = '?'+FORMAL+'=' + (useFormalDeclareNames ? 'true' : 'false');

			this.nsfo.doGetRequest(this.nsfo.URI_ERRORS_DECLARE_TYPES + queryParam)
				.subscribe(
					res => {
						for(let key in res.result) {
							const value = res.result[key];
							let declareName = new DeclareName();
							declareName.formal = key;
							declareName.informal = key;
							this.informalDeclareNames.push(declareName)
						}
						this.isInformalNamesLoaded = true;
					},
					error => {
						alert(this.nsfo.getErrorMessage(error));
					}
				);
		}


		private hideErrorForAdmin(errorMessage: ErrorMessage) {
				this.toggleErrorHideForAdminStatus(errorMessage, true);
		}


		private revealErrorForAdmin(errorMessage: ErrorMessage) {
				this.toggleErrorHideForAdminStatus(errorMessage, false);
		}


		/**
		 * A DeclareBirth can be hidden from the admin in two ways.
		 * 1. DeclareBirth.hideForAdmin = true OR DeclareBirth.getLitter().hideForAdmin = true.
		 * To keep it simple, only the hideForAdmin state on the DeclareBirth will the toggled.
		 *
		 * @param {ErrorMessage} errorMessage
		 * @param {boolean} hideForAdmin
		 */
		private toggleErrorHideForAdminStatus(errorMessage: ErrorMessage, hideForAdmin: boolean) {

				let body = new HideError();
				body.message_id = errorMessage.request_id;
				body.is_ir_message = false;
				body.hide_for_admin = hideForAdmin;

				this.isUpdatingHiddenStatus = true;
				this.nsfo.doPutRequest(this.nsfo.URI_ERRORS_HIDDEN_STATUS, body)
						.subscribe(
						res => {
										errorMessage.hide_for_admin = <HideErrorResponse> res.result.hide_for_admin;
										//todo update error in errors list
								},
								error => {
										alert(this.nsfo.getErrorMessage(error));
								},
								() => {
										this.isUpdatingHiddenStatus = false;
								}
						);
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
				this.filterLogDateStart = '';
				this.filterLogDateEnd = '';
				this.filterEventDateStart = '';
				this.filterEventDateEnd = '';
				this.filterSearch = '';
				this.filterIsHiddenForAdmin = undefined;
				this.filterUbn = '';
				this.filterType = 'ALL';
				this.filterActionByType = 'ALL';
		}


		getFilterOptions(): any[] {
			return [
				this.filterLogDateStart,
				this.filterLogDateEnd,
				this.filterEventDateStart,
				this.filterEventDateEnd,
				this.filterSearch,
				this.filterIsHiddenForAdmin,
				this.filterUbn,
				this.filterType,
				this.filterActionByType,
			];
		}
}