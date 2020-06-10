import { Component } from '@angular/core';
import { FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { Validators } from '@angular/common';
import { TranslatePipe } from 'ng2-translate';

import _ = require("lodash");

import { FormUtilService } from '../../../global/services/utils/form-util.service';
import { TreatmentMedication } from './treatment-medication.model';
import { NSFOService } from '../../../global/services/nsfo/nsfo.service';
import { CheckMarkComponent } from '../../../global/components/checkmark/check-mark.component';
import { SortSwitchComponent } from '../../../global/components/sortswitch/sort-switch.component';
import { SortOrder, SortService } from '../../../global/services/utils/sort.service';
import { TreatmentMedicationFilterPipe } from './treatment-medication-filter.pipe';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-treatment-medicines',
	directives: [CheckMarkComponent, REACTIVE_FORM_DIRECTIVES, SortSwitchComponent],
	template: require('./treatment-medication.component.html'),
	pipes: [TranslatePipe, TreatmentMedicationFilterPipe],
	providers: [FormUtilService, SortService]
})
export class TreatmentMedicationComponent {
	// FILTER
	private filterSearch: string;
	private filterIsActiveStatus: boolean;
	private activeStatuses: boolean[] = [undefined, true, false];

	// SORT
	private isDescriptionSortAscending: boolean;

	// DATA
	private loadingTreatmentMedications: boolean = false;
	private treatmentMedications: TreatmentMedication[] = [];
	private treatmentMedication: TreatmentMedication = new TreatmentMedication();
	private treatmentMedicationTemp: TreatmentMedication = new TreatmentMedication();

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

	private onDestroy$: Subject<void> = new Subject<void>();

	constructor(private nsfo: NSFOService,
							private fb: FormBuilder,
							private formUtilService: FormUtilService,
							private sortService: SortService,
	) {
		this.resetFilterOptions();
		this.getTreatmentMedications();

		this.form = fb.group({
			name: ['', Validators.required]
		});
	}

	ngOnDestroy() {
		this.onDestroy$.next();
		this.onDestroy$.complete();
	}

	getBoolDrowDownText(string: string|boolean): string {
		return this.formUtilService.getBoolDrowDownText(string);
	}

	private getTreatmentMedications(): void {
		this.loadingTreatmentMedications = true;
		this.nsfo.doGetRequest(this.nsfo.URI_TREATMENT_MEDICINES + '?active_only=false')
			.pipe(takeUntil(this.onDestroy$))
			.subscribe(
				res => {
					this.treatmentMedications= <TreatmentMedication[]> res.result;
					this.loadingTreatmentMedications = false;
					this.isDescriptionSortAscending = true;
					this.sortByDescription();
					this.resetFilterOptions();
				}
			);
	}

	addTreatmentMedication() {
		this.isValidForm = true;
		this.isSaving = true;

		if(this.form.valid && this.isValidForm) {

			this.nsfo.doPostRequest(this.nsfo.URI_TREATMENT_MEDICINES, this.treatmentMedication)
				.pipe(takeUntil(this.onDestroy$))
				.subscribe(
					res => {
						if (this.treatmentMedicationTemp) {
							_.remove(this.treatmentMedications, {id: this.treatmentMedicationTemp.id});
						}
						this.treatmentMedication = res.result;
						this.treatmentMedications.push(this.treatmentMedication);
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

	editTreatmentMedication() {
		this.isSaving = true;
		if(this.form.valid && this.isValidForm) {
			this.nsfo.doPutRequest(this.nsfo.URI_TREATMENT_MEDICINES + '/' + this.treatmentMedication.id, this.treatmentMedication)
				.pipe(takeUntil(this.onDestroy$))
				.subscribe(
					res => {
						_.remove(this.treatmentMedications, {id: this.treatmentMedicationTemp.id});
						this.treatmentMedication = res.result;
						this.treatmentMedications.push(this.treatmentMedication);
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

	removeTreatmentMedication() {
		this.isSaving = true;

		_.remove(this.treatmentMedications, {id: this.treatmentMedication.id});
		this.nsfo.doDeleteRequest(this.nsfo.URI_TREATMENT_MEDICINES + '/' + this.treatmentMedication.id, this.treatmentMedication)
			.pipe(takeUntil(this.onDestroy$))
			.subscribe(
				res => {
					this.treatmentMedication = res.result;
					this.treatmentMedications.push(this.treatmentMedication);
					this.isSaving = false;
					this.sortByDescription();
					this.closeRemoveModal();
				},
				err => {
					this.isSaving = false;
					this.errorMessage = this.nsfo.getErrorMessage(err);
					this.treatmentMedications.push(this.treatmentMedication);
				}
			);
	}

	reactivateTreatmentMedication() {
		_.remove(this.treatmentMedications, {id: this.treatmentMedication.id});
		this.addTreatmentMedication();
		this.closeReactivateModal();
	}

	private openModal(editMode: boolean, treatmentMedication: TreatmentMedication): void {
			this.isModalEditMode = editMode;
			this.displayModal = 'block';
			this.isValidForm = true;

			this.treatmentMedicationTemp = _.cloneDeep(treatmentMedication);

			if(editMode) {
				this.treatmentMedication = _.cloneDeep(treatmentMedication);
			}
	}

	private closeModal(): void {
			this.displayModal = 'none';
			this.errorMessage = '';
			this.treatmentMedication = new TreatmentMedication();
			this.resetValidation();
	}

	private openRemoveModal(treatmentMedication: TreatmentMedication) {
			this.treatmentMedication = treatmentMedication;
			this.displayRemoveModal = 'block';
	}

	private closeRemoveModal() {
			this.errorMessage = '';
			this.displayRemoveModal = 'none';
	}

	private openReactivateModal(treatmentMedication: TreatmentMedication) {
		this.treatmentMedication = treatmentMedication;
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

		this.treatmentMedications = this.sortService.sort(this.treatmentMedications, [sortOrder]);
	}
}