import { Component } from '@angular/core';
import { FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { Validators } from '@angular/common';
import { TranslatePipe } from 'ng2-translate';

import _ = require("lodash");

import { INDIVIDUAL, LOCATION } from '../../../global/constants/treatment-types.constant';
import { FormUtilService } from '../../../global/services/utils/form-util.service';
import { TreatmentTemplate } from './treatment-template.model';
import { NSFOService } from '../../../global/services/nsfo/nsfo.service';
import { CheckMarkComponent } from '../../../global/components/checkmark/check-mark.component';
import { TreatmentTemplateFilterPipe } from './treatment-template-filter.pipe';
import { SortSwitchComponent } from '../../../global/components/sortswitch/sort-switch.component';
import { SortOrder, SortService } from '../../../global/services/utils/sort.service';
import { TreatmentType } from '../treatment-type/treatment-type.model';
import { Location } from '../../client/client.model';

@Component({
	selector: 'app-treatment-template',
	directives: [CheckMarkComponent, REACTIVE_FORM_DIRECTIVES, SortSwitchComponent],
	template: require('./treatment-template.component.html'),
	pipes: [TranslatePipe, TreatmentTemplateFilterPipe],
	providers: [FormUtilService, SortService]
})
export class TreatmentTemplateComponent {
	// DATA: GENERAL
	private loadingTreatmentTypes: boolean = true;
	private loadingLocations: boolean = true;
	private treatmentTypes: TreatmentType[] = [];
	private locations: Location[] = [];
	private treatmentTemplateKinds: string[] = [LOCATION, INDIVIDUAL];

	// DATA: CASE SPECIFIC
	private loadingTreatmentTemplates: boolean = true;
	private treatmentTemplates: TreatmentTemplate[] = [];

	// SELECTION
	private isDefaultTemplate: boolean;
	private selectedUbn: string;
	private selectedTreatmentTypeKind: string;
	private wasCaseSelected: boolean;
	private treatmentTemplate: TreatmentTemplate = new TreatmentTemplate();
	private treatmentTemplateTemp: TreatmentTemplate = new TreatmentTemplate();

	// FILTER
	private activeStatuses: boolean[] = [undefined, true, false];
	private filterSearch: string;
	private filterIsActiveStatus: boolean;

	// SORT
	private isDescriptionSortAscending: boolean;

	// FORM
	private form: FormGroup;
	private displayModal: string = 'none';
	private displayRemoveModal: string = 'none';
	private displayReactivateModal: string = 'none';
	private isModalEditMode: boolean = false;
	private isValidForm: boolean = true;
	private errorMessage: string = '';
	private isSaving: boolean = false;

	constructor(private nsfo: NSFOService,
							private fb: FormBuilder,
							private formUtilService: FormUtilService,
							private sortService: SortService,
	) {
		this.isDefaultTemplate = false;
		this.wasCaseSelected = false;
		this.selectedTreatmentTypeKind = LOCATION;
		this.resetFilterOptions();
		this.getGeneralData();

		this.form = fb.group({
			description: ['', Validators.required],
			type: ['', Validators.required]
		});
	}

	getBoolDrowDownText(string: string|boolean): string {
		return this.formUtilService.getBoolDrowDownText(string);
	}

	private getGeneralData(): void {
		this.loadingTreatmentTypes = true;
		this.loadingLocations = true;

		// only get active ubns.
		// For inactive ubns add "?active_only=false"
		this.nsfo.doGetRequest(this.nsfo.URI_UBNS)
			.subscribe(
				res => {
					this.locations = <Location[]> res.result;
					this.loadingLocations = false;
					this.resetFilterOptions();
				}
			);

		this.nsfo.doGetRequest(this.nsfo.URI_TREATMENT_TYPES) // only get active treatment types
			.subscribe(
				res => {
					this.treatmentTypes= <TreatmentType[]> res.result;
					this.loadingTreatmentTypes = false;
					this.resetFilterOptions();
				}
			);
	}

	isFirstSelectionValid(): boolean {
		return this.isDefaultTemplate || (!this.isDefaultTemplate && this.selectedUbn != null);
	}

	isLoadingGeneralData(): boolean {
		return this.loadingTreatmentTypes || this.loadingLocations;
	}

	onCaseSelection() {
		if (this.isDefaultTemplate) {
				this.selectedUbn = null;
		}
		this.wasCaseSelected = true;
		this.getTreatmentData();
	}

	private getTreatmentData(): void {
		this.loadingTreatmentTemplates = true;

		const ubnPart = this.selectedUbn != null ? '/' + this.selectedUbn : '';
		const kindPart = this.selectedTreatmentTypeKind.toLowerCase();

		this.nsfo.doGetRequest(this.nsfo.URI_TREATMENTS + '/template/' + kindPart + ubnPart)
			.subscribe(
				res => {
					this.treatmentTemplates= <TreatmentTemplate[]> res.result;
					this.loadingTreatmentTemplates = false;
					this.isDescriptionSortAscending = true;
					this.sortByDescription();
					this.resetFilterOptions();
				}
			);
	}

	isLoadingTreatmentData() {
			return this.loadingTreatmentTemplates;
	}

	addTreatmentTemplate() {
		this.isValidForm = true;
		this.isSaving = true;

		if(this.form.valid && this.isValidForm) {

			this.nsfo.doPostRequest(this.nsfo.URI_TREATMENTS, this.treatmentTemplate)
				.subscribe(
					res => {
						if (this.treatmentTemplateTemp) {
							_.remove(this.treatmentTemplates, {id: this.treatmentTemplateTemp.id});
						}
						this.treatmentTemplate = res.result;
						this.treatmentTemplates.push(this.treatmentTemplate);
						this.isSaving = false;
						this.sortByDescription();
						this.closeModal();
					},
					err => {
						this.isSaving = false;
						this.errorMessage = "SOMETHING WENT WRONG. TRY ANOTHER TIME."
					}
				);

		} else {
			this.isValidForm = false;
			this.isSaving = false;
		}
	}

	editTreatmentTemplate() {
		this.isSaving = true;
		if(this.form.valid && this.isValidForm) {
			this.nsfo.doPutRequest(this.nsfo.URI_TREATMENT_TYPES + '/' + this.treatmentTemplate.id, this.treatmentTemplate)
				.subscribe(
					res => {
						_.remove(this.treatmentTemplates, {id: this.treatmentTemplateTemp.id});
						this.treatmentTemplate = res.result;
						this.treatmentTemplates.push(this.treatmentTemplate);
						this.isSaving = false;
						this.sortByDescription();
						this.closeModal();
					},
					err => {
						this.isSaving = false;
						this.errorMessage = "SOMETHING WENT WRONG. TRY ANOTHER TIME."
					}
				);
		} else {
			this.isValidForm = false;
			this.isSaving = false;
		}
	}

	removeTreatmentTemplate() {
		this.isSaving = true;

		_.remove(this.treatmentTemplates, {id: this.treatmentTemplate.id});
		this.nsfo.doDeleteRequest(this.nsfo.URI_TREATMENT_TYPES + '/' + this.treatmentTemplate.id, this.treatmentTemplate)
			.subscribe(
				res => {
					this.treatmentTemplate = res.result;
					this.treatmentTemplates.push(this.treatmentTemplate);
					this.isSaving = false;
					this.sortByDescription();
					this.closeRemoveModal();
				},
				err => {
					this.isSaving = false;
					this.errorMessage = "SOMETHING WENT WRONG. TRY ANOTHER TIME."
					this.treatmentTemplates.push(this.treatmentTemplate);
				}
			);
	}

	reactivateTreatmentTemplate() {
		_.remove(this.treatmentTemplates, {id: this.treatmentTemplate.id});
		this.addTreatmentTemplate();
		this.closeReactivateModal();
	}


	private openModal(editMode: boolean, treatmentTemplate: TreatmentTemplate): void {
		this.isModalEditMode = editMode;
		this.displayModal = 'block';
		this.isValidForm = true;

		this.treatmentTemplateTemp = _.cloneDeep(treatmentTemplate);

		if(editMode) {
			this.treatmentTemplate = _.cloneDeep(treatmentTemplate);
		}
	}

	private closeModal(): void {
		this.displayModal = 'none';
		this.errorMessage = '';
		this.treatmentTemplate = new TreatmentTemplate();
		this.resetValidation();
	}

	private openRemoveModal(treatmentTemplate: TreatmentTemplate) {
		this.treatmentTemplate = treatmentTemplate;
		this.displayRemoveModal = 'block';
	}

	private closeRemoveModal() {
		this.errorMessage = '';
		this.displayRemoveModal = 'none';
	}

	private openReactivateModal(treatmentTemplate: TreatmentTemplate) {
		this.treatmentTemplate = treatmentTemplate;
		this.displayReactivateModal = 'block';
	}

	private closeReactivateModal() {
		this.errorMessage = '';
		this.displayReactivateModal = 'none';
	}

	private resetValidation(): void {
		this.isValidForm = true;
	}


	getFilterOptions(): any[] {
		return [
			this.filterSearch,
			this.filterIsActiveStatus,
		];
	}

	resetFilterOptions() {
		this.filterSearch = '';
		this.filterIsActiveStatus = true;
	}

	onSortByDescriptionToggle() {
		//toggle sort direction
		this.isDescriptionSortAscending = !this.isDescriptionSortAscending;
		this.sortByDescription();
	}

	sortByDescription() {
		const sortOrder = new SortOrder();
		sortOrder.variableName = 'description';
		sortOrder.isDate = false; //it is a dateString
		sortOrder.ascending = this.isDescriptionSortAscending;

		this.treatmentTemplates = this.sortService.sort(this.treatmentTemplates, [sortOrder]);
	}
}