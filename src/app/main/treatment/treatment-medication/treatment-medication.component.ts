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
import {MEDICATION_DOSAGE_UNIT} from "../../../global/constants/medication-dosage-unit.constant";
import {
	TREATMENT_DURATION_OPTION,
	TreatmentDurationOption
} from "../../../global/constants/treatment-duration-option.constant";

@Component({
	selector: 'app-treatment-medicines',
	directives: [CheckMarkComponent, REACTIVE_FORM_DIRECTIVES, SortSwitchComponent],
	template: require('./treatment-medication.component.html'),
	pipes: [TranslatePipe, TreatmentMedicationFilterPipe],
	providers: [FormUtilService, SortService]
})
export class TreatmentMedicationComponent {
	// FILTER
	public filterSearch: string;
	public filterIsActiveStatus: boolean;
	public activeStatuses: boolean[] = [undefined, true, false];

	public medicationDosageUnits: string[] = MEDICATION_DOSAGE_UNIT;
	public treatmentDurationOptions: TreatmentDurationOption[] = TREATMENT_DURATION_OPTION;

	// SORT
	public sort = {
		nameAscending: true,
		dosageAscending: true,
		regNLAscending: true,
		treatmentDurationAscending: true,
		waitingDaysAscending: true
	};

	// DATA
	public loadingTreatmentMedications: boolean = false;
	public treatmentMedications: TreatmentMedication[] = [];
	public treatmentMedication: TreatmentMedication = new TreatmentMedication();
	private treatmentMedicationTemp: TreatmentMedication = new TreatmentMedication();

	// FORM
	public form: FormGroup;
	public displayModal: string = 'none';
	public displayRemoveModal: string = 'none';
	public displayReactivateModal: string = 'none';
	public isModalEditMode: boolean = false;
	public isValidForm: boolean = true;
	public errorMessage: string = '';
	public isSaving: boolean = false;

	public page: number = 1;

	private onDestroy$: Subject<void> = new Subject<void>();

	constructor(private nsfo: NSFOService,
							private fb: FormBuilder,
							private formUtilService: FormUtilService,
							private sortService: SortService,
	) {
		this.resetFilterOptions();
		this.getTreatmentMedications();

		this.form = fb.group({
			name: ['', Validators.required],
			dosage: ['', Validators.required],
			dosage_unit: ['', Validators.required],
			reg_nl: [''],
			waiting_days: ['', Validators.required],
			treatment_duration: ['', Validators.required]
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
					this.treatmentMedications = <TreatmentMedication[]> res.result;
					this.loadingTreatmentMedications = false;
					// this.isNameSortAscending = true;
					this.sortByColumn();
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
						this.sortByColumn();
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
						this.sortByColumn();
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
					this.sortByColumn();
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

	private openModal(editMode: boolean, treatmentMedication: TreatmentMedication = new TreatmentMedication()): void {
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

	onSortByColumnToggle(column = 'name') {
		//toggle sort direction
		switch (column) {
			case "dosage":
				this.sort.dosageAscending = !this.sort.dosageAscending;
			break;
			case "regNL":
				this.sort.regNLAscending = !this.sort.regNLAscending;
			break;
			case "treatmentDuration":
				this.sort.treatmentDurationAscending = !this.sort.treatmentDurationAscending;
			break;
			case "waitingDays":
				this.sort.waitingDaysAscending = !this.sort.waitingDaysAscending;
			break;
			default:
				this.sort.nameAscending = !this.sort.nameAscending;
			break;
		}
		this.sortByColumn(column);
	}

	sortByColumn(column = 'name') {
		const sortOrder = new SortOrder();
		sortOrder.variableName = column;
		sortOrder.isDate = false; //it is a dateString

		switch (column) {
			case "dosage":
				sortOrder.ascending = this.sort.dosageAscending;
			break;
			case "regNL":
				sortOrder.ascending = this.sort.regNLAscending;
			break;
			case "treatmentDuration":
				sortOrder.ascending = this.sort.treatmentDurationAscending;
			break;
			case "waitingDays":
				sortOrder.ascending = this.sort.waitingDaysAscending;
			break;
			default:
				sortOrder.ascending = this.sort.nameAscending;
			break;
		}

		this.treatmentMedications = this.sortService.sort(this.treatmentMedications, [sortOrder]);
	}
}