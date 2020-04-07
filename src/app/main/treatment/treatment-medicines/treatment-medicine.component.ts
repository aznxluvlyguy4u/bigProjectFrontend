import { Component } from '@angular/core';
import { FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { Validators } from '@angular/common';
import { TranslatePipe } from 'ng2-translate';

import _ = require("lodash");

import { FormUtilService } from '../../../global/services/utils/form-util.service';
import { TreatmentMedicine } from './treatment-medicine.model';
import { NSFOService } from '../../../global/services/nsfo/nsfo.service';
import { CheckMarkComponent } from '../../../global/components/checkmark/check-mark.component';
import { SortSwitchComponent } from '../../../global/components/sortswitch/sort-switch.component';
import { SortOrder, SortService } from '../../../global/services/utils/sort.service';
import { TreatmentMedicineFilterPipe } from './treatment-medicine-filter.pipe';

@Component({
	selector: 'app-treatment-medicines',
	directives: [CheckMarkComponent, REACTIVE_FORM_DIRECTIVES, SortSwitchComponent],
	template: require('./treatment-medicine.component.html'),
	pipes: [TranslatePipe, TreatmentMedicineFilterPipe],
	providers: [FormUtilService, SortService]
})
export class TreatmentMedicineComponent {
	// FILTER
	private filterSearch: string;
	private filterIsActiveStatus: boolean;
	private activeStatuses: boolean[] = [undefined, true, false];

	// SORT
	private isDescriptionSortAscending: boolean;

	// DATA
	private loadingTreatmentMedicines: boolean = false;
	private treatmentMedicines: TreatmentMedicine[] = [];
	private treatmentMedicine: TreatmentMedicine = new TreatmentMedicine();
	private treatmentMedicineTemp: TreatmentMedicine = new TreatmentMedicine();

	// FORM
	private form: FormGroup;
	private displayModal: string = 'none';
	private displayRemoveModal: string = 'none';
	private displayReactivateModal: string = 'none';
	private isModalEditMode: boolean = false;
	private isValidForm: boolean = true;
	private errorMessage: string = '';
	private isSaving: boolean = false;
	
	private page: number = 1;

	constructor(private nsfo: NSFOService,
							private fb: FormBuilder,
							private formUtilService: FormUtilService,
							private sortService: SortService,
	) {
		this.resetFilterOptions();
		this.getTreatmentMedicines();

		this.form = fb.group({
			name: ['', Validators.required]
		});
	}

	getBoolDrowDownText(string: string|boolean): string {
		return this.formUtilService.getBoolDrowDownText(string);
	}

	private getTreatmentMedicines(): void {
		this.loadingTreatmentMedicines = true;
		this.nsfo.doGetRequest(this.nsfo.URI_TREATMENT_MEDICINES + '?active_only=false')
		.subscribe(
			res => {
				this.treatmentMedicines= <TreatmentMedicine[]> res.result;
				console.log(this.treatmentMedicines);
				this.loadingTreatmentMedicines = false;
				this.isDescriptionSortAscending = true;
				this.sortByDescription();
				this.resetFilterOptions();
			}
		);
	}

	addTreatmentMedicine() {
		this.isValidForm = true;
		this.isSaving = true;

		if(this.form.valid && this.isValidForm) {

			this.nsfo.doPostRequest(this.nsfo.URI_TREATMENT_MEDICINES, this.treatmentMedicine)
				.subscribe(
					res => {
						if (this.treatmentMedicineTemp) {
							_.remove(this.treatmentMedicines, {id: this.treatmentMedicineTemp.id});
						}
						this.treatmentMedicine = res.result;
						this.treatmentMedicines.push(this.treatmentMedicine);
						this.isSaving = false;
						this.sortByDescription();
						this.closeModal();
					},
					err => {
						this.isSaving = false;
						this.errorMessage = this.nsfo.getErrorMessage(err);
					}
				);

		} else {
			this.isValidForm = false;
			this.isSaving = false;
		}
	}

	editTreatmentMedicine() {
		this.isSaving = true;
		if(this.form.valid && this.isValidForm) {
			this.nsfo.doPutRequest(this.nsfo.URI_TREATMENT_MEDICINES + '/' + this.treatmentMedicine.id, this.treatmentMedicine)
				.subscribe(
					res => {
						_.remove(this.treatmentMedicines, {id: this.treatmentMedicineTemp.id});
						this.treatmentMedicine = res.result;
						this.treatmentMedicines.push(this.treatmentMedicine);
						this.isSaving = false;
						this.sortByDescription();
						this.closeModal();
					},
					err => {
						this.isSaving = false;
						this.errorMessage = this.nsfo.getErrorMessage(err);
					}
				);
		} else {
			this.isValidForm = false;
			this.isSaving = false;
		}
	}

	removeTreatmentMedicine() {
		this.isSaving = true;

		_.remove(this.treatmentMedicines, {id: this.treatmentMedicine.id});
		this.nsfo.doDeleteRequest(this.nsfo.URI_TREATMENT_MEDICINES + '/' + this.treatmentMedicine.id, this.treatmentMedicine)
			.subscribe(
				res => {
					this.treatmentMedicine = res.result;
					this.treatmentMedicines.push(this.treatmentMedicine);
					this.isSaving = false;
					this.sortByDescription();
					this.closeRemoveModal();
				},
				err => {
					this.isSaving = false;
					this.errorMessage = this.nsfo.getErrorMessage(err);
					this.treatmentMedicines.push(this.treatmentMedicine);
				}
			);
	}

	reactivateTreatmentMedicine() {
		_.remove(this.treatmentMedicines, {id: this.treatmentMedicine.id});
		this.addTreatmentMedicine();
		this.closeReactivateModal();
	}

	private openModal(editMode: boolean, treatmentMedicine: TreatmentMedicine): void {
			this.isModalEditMode = editMode;
			this.displayModal = 'block';
			this.isValidForm = true;

			this.treatmentMedicineTemp = _.cloneDeep(treatmentMedicine);

			if(editMode) {
				this.treatmentMedicine = _.cloneDeep(treatmentMedicine);
			}
	}

	private closeModal(): void {
			this.displayModal = 'none';
			this.errorMessage = '';
			this.treatmentMedicine = new TreatmentMedicine();
			this.resetValidation();
	}

	private openRemoveModal(treatmentMedicine: TreatmentMedicine) {
			this.treatmentMedicine = treatmentMedicine;
			this.displayRemoveModal = 'block';
	}

	private closeRemoveModal() {
			this.errorMessage = '';
			this.displayRemoveModal = 'none';
	}

	private openReactivateModal(treatmentMedicine: TreatmentMedicine) {
		this.treatmentMedicine = treatmentMedicine;
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
		sortOrder.variableName = 'name';
		sortOrder.isDate = false; //it is a dateString
		sortOrder.ascending = this.isDescriptionSortAscending;

		this.treatmentMedicines = this.sortService.sort(this.treatmentMedicines, [sortOrder]);
	}
}