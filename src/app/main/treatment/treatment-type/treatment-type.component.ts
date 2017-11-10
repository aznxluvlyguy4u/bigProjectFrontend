import { Component } from '@angular/core';
import { FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { Validators } from '@angular/common';
import { TranslatePipe } from 'ng2-translate';

import _ = require("lodash");

import { INDIVIDUAL, LOCATION } from '../../../global/constants/treatment-types.constant';
import { FormUtilService } from '../../../global/services/utils/form-util.service';
import { TreatmentType } from './treatment-type.model';
import { NSFOService } from '../../../global/services/nsfo/nsfo.service';
import { CheckMarkComponent } from '../../../global/components/checkmark/check-mark.component';
import { TreatmentTypeFilterPipe } from './treatment-type-filter.pipe';
import { SortSwitchComponent } from '../../../global/components/sortswitch/sort-switch.component';
import { SortOrder, SortService } from '../../../global/services/utils/sort.service';

@Component({
	selector: 'app-treatment-type',
	directives: [CheckMarkComponent, REACTIVE_FORM_DIRECTIVES, SortSwitchComponent],
	template: require('./treatment-type.component.html'),
	pipes: [TranslatePipe, TreatmentTypeFilterPipe],
	providers: [FormUtilService, SortService]
})
export class TreatmentTypeComponent {
	// FILTER
	private activeStatuses: boolean[] = [undefined, true, false];
	private treatmentTypeKinds: string[] = [LOCATION, INDIVIDUAL];
	private filterSearch: string;
	private filterType: string;
	private filterIsActiveStatus: boolean;

	// SORT
	private isDescriptionSortAscending: boolean;

	// DATA
	private loadingTreatmentTypes: boolean = true;
	private treatmentTypes: TreatmentType[] = [];
	private treatmentType: TreatmentType = new TreatmentType();
	private treatmentTypeTemp: TreatmentType = new TreatmentType();

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
		this.resetFilterOptions();
		this.getTreatmentTypes();

		this.form = fb.group({
			description: ['', Validators.required],
			type: ['', Validators.required]
		});
	}

	getBoolDrowDownText(string: string|boolean): string {
		return this.formUtilService.getBoolDrowDownText(string);
	}

	private getTreatmentTypes(): void {
		this.loadingTreatmentTypes = true;
		this.nsfo.doGetRequest(this.nsfo.URI_TREATMENT_TYPES + '?active_only=false')
			.subscribe(
				res => {
					this.treatmentTypes= <TreatmentType[]> res.result;
					this.loadingTreatmentTypes = false;
					this.isDescriptionSortAscending = true;
					this.sortByDescription();
					this.resetFilterOptions();
				}
			);
	}

	addTreatmentType() {
		this.isValidForm = true;
		this.isSaving = true;

		if(this.form.valid && this.isValidForm) {

			this.nsfo.doPostRequest(this.nsfo.URI_TREATMENT_TYPES, this.treatmentType)
				.subscribe(
					res => {
						if (this.treatmentTypeTemp) {
							_.remove(this.treatmentTypes, {id: this.treatmentTypeTemp.id});
						}
						this.treatmentType = res.result;
						this.treatmentTypes.push(this.treatmentType);
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

	editTreatmentType() {
		this.isSaving = true;
		if(this.form.valid && this.isValidForm) {
			this.nsfo.doPutRequest(this.nsfo.URI_TREATMENT_TYPES + '/' + this.treatmentType.id, this.treatmentType)
				.subscribe(
					res => {
						_.remove(this.treatmentTypes, {id: this.treatmentTypeTemp.id});
						this.treatmentType = res.result;
						this.treatmentTypes.push(this.treatmentType);
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

	removeTreatmentType() {
		this.isSaving = true;

		_.remove(this.treatmentTypes, {id: this.treatmentType.id});
		this.nsfo.doDeleteRequest(this.nsfo.URI_TREATMENT_TYPES + '/' + this.treatmentType.id, this.treatmentType)
			.subscribe(
				res => {
					this.treatmentType = res.result;
					this.treatmentTypes.push(this.treatmentType);
					this.isSaving = false;
					this.sortByDescription();
					this.closeRemoveModal();
				},
				err => {
					this.isSaving = false;
					this.errorMessage = "SOMETHING WENT WRONG. TRY ANOTHER TIME."
					this.treatmentTypes.push(this.treatmentType);
				}
			);
	}

	reactivateTreatmentType() {
		_.remove(this.treatmentTypes, {id: this.treatmentType.id});
		this.addTreatmentType();
		this.closeReactivateModal();
	}


	private openModal(editMode: boolean, treatmentType: TreatmentType): void {
			this.isModalEditMode = editMode;
			this.displayModal = 'block';
			this.isValidForm = true;

			this.treatmentTypeTemp = _.cloneDeep(treatmentType);

			if(editMode) {
				this.treatmentType = _.cloneDeep(treatmentType);
			}
	}

	private closeModal(): void {
			this.displayModal = 'none';
			this.errorMessage = '';
			this.treatmentType = new TreatmentType();
			this.resetValidation();
	}

	private openRemoveModal(treatmentType: TreatmentType) {
			this.treatmentType = treatmentType;
			this.displayRemoveModal = 'block';
	}

	private closeRemoveModal() {
			this.errorMessage = '';
			this.displayRemoveModal = 'none';
	}

	private openReactivateModal(treatmentType: TreatmentType) {
		this.treatmentType = treatmentType;
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
			this.filterType,
			this.filterIsActiveStatus,
		];
	}

	resetFilterOptions() {
		this.filterSearch = '';
		this.filterType = 'ALL';
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

		this.treatmentTypes = this.sortService.sort(this.treatmentTypes, [sortOrder]);
	}
}