import { Component, OnDestroy, OnInit } from '@angular/core';
import { SortOrder, SortService } from '../../global/services/utils/sort.service';
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
import { TranslatePipe, TranslateService } from 'ng2-translate';
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
import { HideButtonComponent } from '../../global/components/hidebutton/hide-button.component';
import { GhostLoginDetailsWithUbn } from '../client/client.model';
import { GhostLoginModalComponent } from '../../global/components/ghostloginmodal/ghostlogin-modal.component';
import { InfoButtonComponent } from '../../global/components/infobutton/info-button.component';
import { DeclareResponseModel } from './models/declare-response.model';
import { DeclareDetailsModel } from './models/declare-details.model';
import { DECLARE_BIRTH, DECLARE_TAG_TRANSFER } from '../../global/constants/declare-type.constant';
import { Litter } from '../../global/models/litter.model';
import { DeclareBirth } from '../../global/models/declare-birth.model';
import { DeclareTagTransfer } from '../../global/models/declare-tag-transfer.model';
import { TagTransferItemResponse } from '../../global/models/tag-transfer-item-response.model';
import { DeclareTagTransferFilterPipe } from './pipes/declare-tag-transfer-filter.pipe';
import { UcFirstPipe } from '../../global/pipes/uc-first.pipe';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
		providers: [PaginationService, SortService, DateTimeService, FormUtilService, ErrorLogFilterPipe],
		directives: [REACTIVE_FORM_DIRECTIVES, ROUTER_DIRECTIVES, PaginationComponent, SearchComponent, Datepicker,
			CheckMarkComponent, SortSwitchComponent, HideButtonComponent, GhostLoginModalComponent, InfoButtonComponent],
		template: require('./error-log-overview.component.html'),
		pipes: [TranslatePipe, ErrorLogFilterPipe, PaginatePipe, UserSearchPipe, DeclareTagTransferFilterPipe, UcFirstPipe ]
})
export class ErrorLogOverviewComponent implements OnInit, OnDestroy {

		private isErrorsLoaded: boolean;
		private isGhostLoginDataLoaded: boolean;
		private isInformalNamesLoaded: boolean;
		private isUpdatingHiddenStatus: boolean;
		private updatedSingleHiddenStatusMessageId: string;

		public errors: ErrorMessage[];
		private declareType = 'informal';
		private declareNames: DeclareName[] = [];
		private declareTypesForDropdown;

		ghostLoginData: GhostLoginDetailsWithUbn[] = [];

		private filterAmount: number = 10;
		private filterAmountOptions = [10, 25, 50];
		private filterIsHiddenForAdminOptions = [undefined, true, false];
		private filterIsHiddenForUserOptions = [undefined, true, false];

		private filterLogDateStart: string;
		private filterLogDateEnd: string;
		private filterEventDateStart: string;
		private filterEventDateEnd: string;
		private filterSearch: string; // Search in action_by and declare_info
		private filterIsHiddenForAdmin: boolean;
		private filterIsHiddenForUser: boolean;
		private filterUbn: string; // filter in ubn and related_ubn
		private filterRelatedUbn: string; // filter in ubn and related_ubn
		private filterType: string;
		private filterActionByType: string;

		private modalDisplay: string = 'none';
		private toHideCount: number = 0;
		private ghostLoginModalDisplay: string = 'none';
		selectedGhostLoginDetails: GhostLoginDetailsWithUbn;
		selectedError: ErrorMessage;
		selectedMessage: DeclareDetailsModel;
		selectedBirthError: ErrorMessage;
		selectedTagTransferError: ErrorMessage;
		selectedTagTransfer: DeclareTagTransfer;
		selectedLitterDetails: Litter;
		private infoModalDisplay: string = 'none';
		private birthInfoModalDisplay: string = 'none';
		private tagTransferInfoModalDisplay: string = 'none';

		tagTransferUlnSearchValue: string;

		isLogDateSortAscending: boolean;
		isLogDateSortNeutral: boolean;
		isEventDateSortAscending: boolean;
		isEventDateSortNeutral: boolean;

		private onDestroy$: Subject<void> = new Subject<void>();

		constructor(private nsfo: NSFOService, private formBuilder: FormBuilder,
								private settings: SettingsService, private sortService: SortService,
								private dateTimeService: DateTimeService, private formUtilService: FormUtilService,
								private errorLogFilterService: ErrorLogFilterPipe,
								private translateService: TranslateService
		) {
				this.initializeValues();
				this.resetFilterOptions();
		}

		private initializeValues() {
				this.errors = [];
				this.declareNames = [];
				this.ghostLoginData = [];
				this.isErrorsLoaded = false;
				this.isGhostLoginDataLoaded = false;
				this.isInformalNamesLoaded = false;
				this.isUpdatingHiddenStatus = false;
				this.updatedSingleHiddenStatusMessageId = null;
				this.tagTransferUlnSearchValue = null;
		}

		public ngOnInit() {
				this.filterType = null;
				this.filterIsHiddenForAdmin = undefined; // show all
				this.getErrors();
				this.doGetDeclareTypesRequest(true);
				this.doGetDeclareTypesRequest(false);
				this.doGetUbnsWithGhostLoginDataRequest();
		}

		ngOnDestroy() {
				this.initializeValues();
				this.onDestroy$.next();
		}


		public isDataLoaded(): boolean {
				return this.isErrorsLoaded && this.isInformalNamesLoaded;
		}


		private getErrors(includeHiddenForAdmin: boolean = false) {
				const queryParam = includeHiddenForAdmin ? '?'+SHOW_HIDDEN+'=true' : '';

				this.nsfo.doGetRequest(this.nsfo.URI_ERRORS + queryParam)
					.pipe(takeUntil(this.onDestroy$))
						.subscribe(
						res => {
							this.errors = <ErrorMessage[]> res.result;
							this.isErrorsLoaded = true;
						},
						error => {
								alert(this.nsfo.getErrorMessage(error));
						},
							() => {
								this.updateGhostLoginValuesInErrorMessages();
						}
				);
		}


		private getMessageDetails(requestId: string) {
				this.nsfo.doGetRequest(this.nsfo.URI_ERRORS + '/' + requestId)
					.pipe(takeUntil(this.onDestroy$))
					.subscribe(
						res => {
							switch (res.result.type) {
								case DECLARE_TAG_TRANSFER: this.selectedTagTransfer = res.result; break;
								default: this.selectedMessage = res.result; break;
							}
						},
						error => {
							alert(this.nsfo.getErrorMessage(error));
						}
					);
		}


		private getLitterDetails(nonIrRequestId: string) {
				this.nsfo.doGetRequest(this.nsfo.URI_ERRORS_NON_IR + '/' + nonIrRequestId)
					.pipe(takeUntil(this.onDestroy$))
					.subscribe(
						res => {
							this.selectedLitterDetails = res.result;
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
				.pipe(takeUntil(this.onDestroy$))
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

						this.initializeDateSortValues();
					},
					error => {
						alert(this.nsfo.getErrorMessage(error));
					}
				);
		}


		private doGetUbnsWithGhostLoginDataRequest() {
				const queryParam = '?include_ghost_login_data=true';

				this.nsfo.doGetRequest(this.nsfo.URI_UBNS + queryParam)
					.pipe(takeUntil(this.onDestroy$))
						.subscribe(
								res => {
										this.ghostLoginData = res.result;
										this.isGhostLoginDataLoaded = true;
										this.updateGhostLoginValuesInErrorMessages();
								},
								error => {
										alert(this.nsfo.getErrorMessage(error));
								}
					);
		}


		private updateGhostLoginValuesInErrorMessages() {
				if (this.errors.length === 0 || this.ghostLoginData.length === 0) {
						return;
				}

				for(let error of this.errors) {
						error.has_ghost_login = this.hasUbnGhostLogin(error.ubn);
				}
		}


		private hasUbnGhostLogin(ubn: string): boolean {
				const ghostLoginDetailsWithUbn = _.find(this.ghostLoginData, {ubn: ubn});
				if (ghostLoginDetailsWithUbn) {
						return ghostLoginDetailsWithUbn.has_ghost_login;
				}
				return false;
		}


		getErrorMessagesToHide(): ErrorMessage[] {
				return this.errorLogFilterService.transform(this.errors, this.getFilterOptions()).filter(
					errorMessage => {
						return errorMessage.hide_for_admin === false;
					});
		}


		updateToHideCount() {
				this.toHideCount = this.getErrorMessagesToHide().length;
		}


		hideShownErrorsForAdmin() {
				const errorMessagesToHide = this.getErrorMessagesToHide();
				this.closeModal();
				this.hideErrorsForAdmin(errorMessagesToHide);
		}


		hideBirthForAdmin(birth: DeclareBirth) {
				let errorMessage = new ErrorMessage();
				errorMessage.request_id = birth.message_id ? birth.message_id : birth.request_id;
				errorMessage.hide_for_admin = birth.hide_for_admin;
				errorMessage.hide_failed_message = birth.hide_failed_message;
				this.toggleErrorsHideForAdminStatus([errorMessage], true);
		}


		hideSingleErrorForAdminStatus(errorMessage: ErrorMessage) {
				this.toggleErrorsHideForAdminStatus([errorMessage], true);
		}


		private hideErrorsForAdmin(errorMessages: ErrorMessage[]) {
				this.toggleErrorsHideForAdminStatus(errorMessages, true);
		}


		private revealErrorsForAdmin(errorMessages: ErrorMessage[]) {
				this.toggleErrorsHideForAdminStatus(errorMessages, false);
		}


		/**
		 * A DeclareBirth can be hidden from the admin in two ways.
		 * 1. DeclareBirth.hideForAdmin = true OR DeclareBirth.getLitter().hideForAdmin = true.
		 * To keep it simple, only the hideForAdmin state on the DeclareBirth will the toggled.
		 *
		 * @param {ErrorMessage} errorMessages with the new
		 * @param {boolean} hideForAdmin
		 */
		private toggleErrorsHideForAdminStatus(errorMessages: ErrorMessage[], hideForAdmin: boolean) {

				let edits: HideError[] = [];

				for(let errorMessage of errorMessages) {

						// For now we only hide on IR level.
						// It is for example also possible to hide a whole litter, but we will keep it simple for now

						if (errorMessage.hide_for_admin !== hideForAdmin) {
								let errorToEdit = new HideError();
								errorToEdit.message_id = errorMessage.request_id;
								errorToEdit.is_ir_message = true;
								errorToEdit.hide_for_admin = hideForAdmin;

								edits.push(errorToEdit);
						}
				}

				if (edits.length === 0) {
						return;
				}

				const body = {
					is_multi_edit: true,
					edits: edits
				};

				if (errorMessages.length === 1) {
						this.updatedSingleHiddenStatusMessageId = errorMessages.pop().request_id;
				} else {
						this.isUpdatingHiddenStatus = true;
				}

				this.nsfo.doPutRequest(this.nsfo.URI_ERRORS_HIDDEN_STATUS, body)
					.pipe(takeUntil(this.onDestroy$))
						.subscribe(
						res => {
										this.updateErrorMessagesFromUpdateResponse(res);
								},
								error => {
										alert(this.nsfo.getErrorMessage(error));

										if (error && error.result && error.result.success_count > 0) {
												this.updateErrorMessagesFromUpdateResponse(error);
										}
										this.isUpdatingHiddenStatus = false;
										this.updatedSingleHiddenStatusMessageId = null;
								},
								() => {
										this.isUpdatingHiddenStatus = false;
										this.updatedSingleHiddenStatusMessageId = null;
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

						if (this.selectedLitterDetails != null && this.selectedLitterDetails.declare_births != null && this.selectedLitterDetails.declare_births.length > 0) {
								let currentBirth = _.find(this.selectedLitterDetails.declare_births, {message_id: successfulEdit.message_id});

										if (currentBirth && currentBirth.hide_for_admin !== successfulEdit.hide_for_admin) {
											const index = _.findIndex(this.selectedLitterDetails.declare_births, {message_id: successfulEdit.message_id});
											currentBirth.hide_for_admin = successfulEdit.hide_for_admin;
											this.selectedLitterDetails.declare_births.splice(index, 1, currentBirth);
								}
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
				this.filterIsHiddenForUser = undefined;
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
				this.filterIsHiddenForUser,
			];
		}

		getBoolDrowDownText(string: string|boolean): string {
				return this.formUtilService.getBoolDrowDownText(string);
		}

		openModal() {
			this.updateToHideCount();
			this.modalDisplay = 'block';
		}

		closeModal() {
			this.modalDisplay = 'none';
		}


		initializeDateSortValues() {
				this.isLogDateSortAscending = false;
				this.isLogDateSortNeutral = false;
				this.isEventDateSortAscending = true;
				this.isEventDateSortNeutral = true;
		}

		onSortByLogDateToggle() {
				//toggle sort direction
				this.isLogDateSortAscending = !this.isLogDateSortAscending;
				this.isEventDateSortNeutral = true;
				this.isLogDateSortNeutral = false;
				this.sortByLogDate();
		}

		onSortByEventDateToggle() {
				//toggle sort direction
				this.isEventDateSortAscending = !this.isEventDateSortAscending;
				this.isEventDateSortNeutral = false;
				this.isLogDateSortNeutral = true;
				this.sortByEventDate();
		}


		sortByLogDate() {
				const sortOrder = new SortOrder();
				sortOrder.variableName = 'log_date';
				sortOrder.isDate = false; //it is a dateString
				sortOrder.ascending = this.isLogDateSortAscending;

				this.errors = this.sortService.sort(this.errors, [sortOrder]);
		}

		sortByEventDate() {
				const sortOrder = new SortOrder();
				sortOrder.variableName = 'event_date';
				sortOrder.isDate = false; //it is a dateString
				sortOrder.ascending = this.isEventDateSortAscending;

				this.errors = this.sortService.sort(this.errors, [sortOrder]);
		}

		loginAsGhost(ubn: string) {
				const ghostLoginDetailsWithUbn = _.find(this.ghostLoginData, {ubn: ubn});
				if (ghostLoginDetailsWithUbn) {
						this.selectedGhostLoginDetails = ghostLoginDetailsWithUbn;
						this.openGhostLoginModal();
				} else {
						alert(this.translateService.instant('NO GHOST LOGIN POSSIBLE FOR THIS UBN'));
				}
		}

		afterGhostLogin() {
			 this.selectedGhostLoginDetails = null;
			 this.closeGhostLoginModal();
		}

		private openGhostLoginModal() {
				this.ghostLoginModalDisplay = 'block';
		}

		private closeGhostLoginModal() {
				this.ghostLoginModalDisplay = 'none';
		}

		openInfoModal(error: ErrorMessage) {
				switch (error.type) {
					case DECLARE_BIRTH: this.openBirthInfoModal(error); break;
					case DECLARE_TAG_TRANSFER: this.openTagTransferInfoModal(error); break;
					default: this.openDefaultInfoModal(error); break;
				}
		}

		openBirthInfoModal(error: ErrorMessage) {
				this.getLitterDetails(error.non_ir_request_id);
				this.selectedBirthError = error;
				this.birthInfoModalDisplay = 'block';
		}

		openDefaultInfoModal(error: ErrorMessage) {
				this.getMessageDetails(error.request_id);
				this.selectedError = error;
				this.infoModalDisplay = 'block';
		}

		openTagTransferInfoModal(error: ErrorMessage) {
				this.getMessageDetails(error.request_id);
				this.selectedTagTransferError = error;
				this.tagTransferInfoModalDisplay = 'block';
		}

		closeInfoModal() {
				this.birthInfoModalDisplay = 'none';
				this.selectedLitterDetails = null;
				this.selectedBirthError = null;

				this.tagTransferInfoModalDisplay = 'none';
				this.selectedTagTransfer = null;
				this.selectedTagTransferError = null;

				this.infoModalDisplay = 'none';
				this.selectedError = null;
				this.selectedMessage = null;
		}


		getMotherUln() {
				if (this.selectedLitterDetails.animal_mother) {
					 	return this.selectedLitterDetails.animal_mother.uln_country_code && this.selectedLitterDetails.animal_mother.uln_number ?
							this.selectedLitterDetails.animal_mother.uln_country_code + ' ' + this.selectedLitterDetails.animal_mother.uln_number : '';
				}
				return '';
		}

		getFatherUln() {
				if (this.selectedLitterDetails.animal_father) {
						return this.selectedLitterDetails.animal_father.uln_country_code && this.selectedLitterDetails.animal_father.uln_number ?
							this.selectedLitterDetails.animal_father.uln_country_code + ' ' + this.selectedLitterDetails.animal_father.uln_number : '';
				}
				return '';
		}

		getMotherStn() {
				if (this.selectedLitterDetails.animal_father) {
						return this.selectedLitterDetails.animal_father.pedigree_country_code && this.selectedLitterDetails.animal_father.pedigree_number ?
							this.selectedLitterDetails.animal_father.pedigree_country_code + ' ' + this.selectedLitterDetails.animal_father.pedigree_number : '';
				}
				return '';
		}

		getFatherStn() {
				if (this.selectedLitterDetails.animal_mother) {
						return this.selectedLitterDetails.animal_mother.pedigree_country_code && this.selectedLitterDetails.animal_mother.pedigree_number ?
							this.selectedLitterDetails.animal_mother.pedigree_country_code + ' ' + this.selectedLitterDetails.animal_mother.pedigree_number : '';
				}
				return '';
		}

		getFatherDateOfBirth() {
				return this.selectedLitterDetails.animal_father ? this.selectedLitterDetails.animal_father.date_of_birth : null;
		}

		getMotherDateOfBirth() {
				return this.selectedLitterDetails.animal_mother ? this.selectedLitterDetails.animal_mother.date_of_birth : null;
		}


		getLastTagTransferResponse(responses: TagTransferItemResponse[]): TagTransferItemResponse {
				if (responses == null || responses.length === 0) {
					 return null;
				}

				return _.maxBy(responses, function(o) { return o.log_date });
		}
}