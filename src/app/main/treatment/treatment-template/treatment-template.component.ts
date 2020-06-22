import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MedicineFormEntryComponent } from './medicine-form-entry/medicine-form-entry.component';
import {TreatmentMedication} from "../treatment-medication/treatment-medication.model";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-treatment-template',
	directives: [CheckMarkComponent, REACTIVE_FORM_DIRECTIVES, SortSwitchComponent, MedicineFormEntryComponent],
	template: require('./treatment-template.component.html'),
	pipes: [TranslatePipe, TreatmentTemplateFilterPipe],
	providers: [FormUtilService, SortService]
})
export class TreatmentTemplateComponent implements OnInit {
	// DATA: GENERAL
	private loadingTreatmentTypes: boolean = true;
	private loadingLocations: boolean = true;
	private treatmentTypes: TreatmentType[] = [];
	private treatmentTypesIndividual: string[] = [];
	private treatmentTypesLocation: string[] = [];
	public locations: Location[] = [];
	public treatmentTemplateKinds: string[] = [LOCATION, INDIVIDUAL];

	// DATA: CASE SPECIFIC
	private loadingTreatmentTemplates: boolean = true;
	public treatmentTemplates: TreatmentTemplate[] = [];

	// SELECTION
	public isDefaultTemplate: boolean;
	public selectedUbn: string;
	public selectedTreatmentTypeKind: string;
	public wasCaseSelected: boolean;
	public treatmentTemplate: TreatmentTemplate = new TreatmentTemplate();

	// CREATE
	public newIsDefaultTemplate: boolean;
	public newSelectedUbn: string;
	private medicationId: number;
	private defaultType = LOCATION;
	public newTreatmentTemplate: TreatmentTemplate;
	public newMedications: TreatmentMedication[] = [];
	public descriptionBase: string;
	public descriptionSuffix: string;

	// FILTER
	public activeStatuses: boolean[] = [undefined, true, false];
	public filterSearch: string;
	public filterIsActiveStatus: boolean;

	// SORT
	public isDescriptionSortAscending: boolean;

	// FORM
	public form: FormGroup;
	public cuForm: FormGroup;
	public displayModal: string = 'none';
	public displayRemoveModal: string = 'none';
	public displayReactivateModal: string = 'none';
	public displayInfoModal: string = 'none';
	public isModalEditMode: boolean = false;
	public isValidForm: boolean = true;
	public errorMessage: string = '';
	public isSaving: boolean = false;

	public treatmentMedications: TreatmentMedication[];

	private onDestroy$: Subject<void> = new Subject<void>();

	constructor(
		private nsfo: NSFOService,
		private fb: FormBuilder,
		private formUtilService: FormUtilService,
		private sortService: SortService,
	) {
		this.isDefaultTemplate = false;
		this.wasCaseSelected = false;
		this.selectedTreatmentTypeKind = LOCATION;
		this.resetFilterOptions();
		this.resetCreateOptions();
		this.getGeneralData();
		this.getTreatmentMedicines();
	}

	ngOnDestroy() {
		this.onDestroy$.next();
		this.onDestroy$.complete();
	}

	ngOnInit() {
		this.initCuForm();

		this.form = this.fb.group({
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
			.pipe(takeUntil(this.onDestroy$))
			.subscribe(
				res => {
					this.locations = <Location[]> res.result;
					this.loadingLocations = false;
					this.resetFilterOptions();
				}
			);

		this.nsfo.doGetRequest(this.nsfo.URI_TREATMENT_TYPES) // only get active treatment types
			.pipe(takeUntil(this.onDestroy$))
			.subscribe(
				res => {
					this.treatmentTypes= <TreatmentType[]> res.result;

					for(let treatmentType of this.treatmentTypes) {
						if (treatmentType.is_active) {
							if (treatmentType.type === LOCATION) {
								this.treatmentTypesLocation.push(treatmentType.description);
							} else if (treatmentType.type === INDIVIDUAL) {
								this.treatmentTypesIndividual.push(treatmentType.description);
							}
						}
					}

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

		this.nsfo.doGetRequest(this.nsfo.URI_TREATMENTS + '/template/' + kindPart + ubnPart + '?active_only=false&minimal_output=false')
			.pipe(takeUntil(this.onDestroy$))
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

	getTreatmentTypesByKindInCreateUpdateModal(): string[] {
		if (this.newTreatmentTemplate.type === LOCATION) {
			return this.treatmentTypesLocation;

		} else if(this.newTreatmentTemplate.type === INDIVIDUAL) {
			return this.treatmentTypesIndividual;
		}
		return [];
	}

	addTreatmentTemplate() {
		this.validateForm();
		this.isSaving = true;

		if(this.isValidForm) {

			const type = this.newTreatmentTemplate.type.toLowerCase();

			this.nsfo.doPostRequest(this.nsfo.URI_TREATMENTS + '/' + type + '/template', this.getFormattedTreatmentTypeBody())
				.pipe(takeUntil(this.onDestroy$))
				.subscribe(
					res => {
						this.treatmentTemplate = res.result;
						this.treatmentTemplates.push(this.treatmentTemplate);
						this.resetCreateOptions();
						this.sortByDescription();
						this.getTreatmentData();
						this.closeModal();
						this.isSaving = false;
					},
					err => {
						this.isSaving = false;
						this.errorMessage = this.nsfo.getErrorMessage(err);
					}
				);

		} else {
			this.isSaving = false;
		}
	}

	getFormattedTreatmentTypeBody() {
		if (!this.newIsDefaultTemplate) {
			this.newTreatmentTemplate.location = {ubn: this.newSelectedUbn};
		}

		let medications: TreatmentMedication[] = [];
		console.log(this.newMedications);
		for(let medication of this.newMedications) {
			if (medication.is_active) {
				const newMedication = new TreatmentMedication(true);
				newMedication.name = medication.name;
				medications.push(newMedication);
			}
		}

		// removes the keys and values not necessary for the request
		// for(let medication of medications) {
		// 	delete medication.id;
		// 	delete medication.is_active;
		// 	delete medication.dosage_unit;
		// 	delete medication.dosage;
		// 	delete medication.waiting_days;
		// 	delete medication.treatment_duration;
		// 	delete medication.treatment_templates;
		// 	delete medication.reg_nl;
		// }

		this.newTreatmentTemplate.treatment_medications = medications;

		let treatmentTemplate = _.cloneDeep(this.newTreatmentTemplate);
		delete treatmentTemplate.type;

		return treatmentTemplate;
	}

	validateForm(): boolean {
		const hasValidLocationData = this.newIsDefaultTemplate === true ? this.newSelectedUbn == null : this.newSelectedUbn != null;

		let hasCompleteMedicationData = true;
		for(let medication of this.newTreatmentTemplate.treatment_medications) {
			if (medication.dosage == null) {
				hasCompleteMedicationData = false;
			}
		}

		this.isValidForm = this.newTreatmentTemplate.type != null &&
			this.newTreatmentTemplate.description != null && hasValidLocationData && hasCompleteMedicationData && this.hasAtLeastOneMedication();

		return this.isValidForm;
	}

	hasAtLeastOneMedication() {
		return this.newMedications != null ? this.newMedications.length > 0 : false;
	}

	editTreatmentTemplate() {
		this.validateForm();
		this.isSaving = true;

		if(this.isValidForm) {
			const treatmentTemplate = this.getFormattedTreatmentTypeBody();
			// console.log(treatmentTemplate.treatment_medications);

			const type = this.newTreatmentTemplate.type.toLowerCase();

			this.nsfo.doPutRequest(this.nsfo.URI_TREATMENTS + '/' + type + '/template/' + treatmentTemplate.id+'?minimal_output=false', treatmentTemplate)
				.pipe(takeUntil(this.onDestroy$))
				.subscribe(
					res => {
						this.treatmentTemplate = res.result;
						this.updateInTreatmentTemplates(this.treatmentTemplate);
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

	removeTreatmentTemplate() {
		this.isSaving = true;

		const type = this.treatmentTemplate.type.toLowerCase();

		this.nsfo.doDeleteRequest(this.nsfo.URI_TREATMENTS + '/' + type + '/template/' + this.treatmentTemplate.id, this.treatmentTemplate)
			.pipe(takeUntil(this.onDestroy$))
			.subscribe(
				res => {
					this.treatmentTemplate = res.result;
					this.updateInTreatmentTemplates(this.treatmentTemplate);
					this.isSaving = false;
					this.sortByDescription();
					this.closeRemoveModal();
				},
				err => {
					this.isSaving = false;
					this.errorMessage = this.nsfo.getErrorMessage(err);
				}
			);
	}

	reactivateTreatmentTemplate() {
		this.isSaving = true;

		const type = this.treatmentTemplate.type.toLowerCase();

		this.nsfo.doPatchRequest(this.nsfo.URI_TREATMENTS + '/' + type + '/template/' + this.treatmentTemplate.id, this.treatmentTemplate)
			.pipe(takeUntil(this.onDestroy$))
			.subscribe(
				res => {
					this.treatmentTemplate = res.result;
					this.updateInTreatmentTemplates(this.treatmentTemplate);
					this.isSaving = false;
					this.sortByDescription();
					this.closeReactivateModal();
				},
				err => {
					this.isSaving = false;
					this.errorMessage = this.nsfo.getErrorMessage(err);
				}
			);
	}

	updateInTreatmentTemplates(treatmentTemplate: TreatmentTemplate) {
		const index = _.findIndex(this.treatmentTemplates, {id: treatmentTemplate.id});
		this.treatmentTemplates.splice(index, 1, treatmentTemplate);
	}

	public openModal(editMode: boolean, treatmentTemplate: TreatmentTemplate = null): void {
		this.isModalEditMode = editMode;
		this.displayModal = 'block';
		this.isValidForm = true;

		this.resetCreateOptions();

		if(editMode) {
			this.newTreatmentTemplate = _.cloneDeep(treatmentTemplate);

			this.newIsDefaultTemplate = true;
			this.newSelectedUbn = null;
			if (this.newTreatmentTemplate.location) {
				const ubn = this.newTreatmentTemplate.location.ubn;
				if (ubn != null) {
					this.newIsDefaultTemplate = false;
					this.newSelectedUbn = ubn;
				}
			}

			if (typeof this.newTreatmentTemplate.treatment_medications !== 'undefined') {
				for(let medication of this.newTreatmentTemplate.treatment_medications) {
					this.newMedications.push(medication);
				}
			}
		}
	}

	getNewIsDefaultTemplateAsYesOrNo() {
		return this.newIsDefaultTemplate ? 'YES' : 'NO';
	}

	public closeModal(): void {
		this.displayModal = 'none';
		this.errorMessage = '';
		this.resetValidation();
		this.resetCreateOptions();

		if (!this.isModalEditMode) {
			this.treatmentTemplate = new TreatmentTemplate();
		}
	}

	public openRemoveModal(treatmentTemplate: TreatmentTemplate) {
		this.treatmentTemplate = treatmentTemplate;
		this.displayRemoveModal = 'block';
	}

	public closeRemoveModal() {
		this.errorMessage = '';
		this.displayRemoveModal = 'none';
	}

	public openReactivateModal(treatmentTemplate: TreatmentTemplate) {
		this.treatmentTemplate = treatmentTemplate;
		this.displayReactivateModal = 'block';
	}

	public closeReactivateModal() {
		this.errorMessage = '';
		this.displayReactivateModal = 'none';
	}

	public openInfoModal(treatmentTemplate: TreatmentTemplate) {
		this.treatmentTemplate = treatmentTemplate;
		this.displayInfoModal = 'block';
	}

	public closeInfoModal() {
		this.errorMessage = '';
		this.displayInfoModal = 'none';
	}

	public resetValidation(): void {
		this.isValidForm = true;
	}

	public setDescriptionValues(descriptionBase ?: string): void {
		if (descriptionBase != null && descriptionBase != '') {
			this.descriptionBase = descriptionBase;
		}
		
		if (this.newSelectedUbn != null) {
			this.descriptionSuffix = ' - UBN ' + this.newSelectedUbn;
		} else {
			this.descriptionSuffix = null;
		}

		if (this.descriptionBase != null && this.descriptionSuffix != null) {
			this.newTreatmentTemplate.description = this.descriptionBase + this.descriptionSuffix;

		} else if (this.descriptionBase != null) {
			this.newTreatmentTemplate.description = this.descriptionBase;
		}

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

	resetSelectedUbn() {
		if (!this.isDefaultTemplate) {
			this.selectedUbn = null;
		}
	}

	resetNewSelectedUbn() {
		if (!this.newIsDefaultTemplate) {
			this.newSelectedUbn = null;
		}
	}

	resetCreateOptions() {
		this.newTreatmentTemplate = new TreatmentTemplate();
		this.newTreatmentTemplate.type = this.defaultType;
		this.newTreatmentTemplate.treatment_medications = [];
		this.newIsDefaultTemplate = false;
		this.descriptionBase = null;
		this.descriptionSuffix = null;
		this.newTreatmentTemplate.description = null;
		this.newSelectedUbn = null;
		this.newMedications = [];
		this.medicationId = 0;
	}

	initCuForm() {
		this.cuForm = this.fb.group({
			allUbnSwitch: ['', Validators.required],
			ubn: [''],
			description: ['', Validators.required],
			type: ['', Validators.required],
		});
	}

	removeMedication(treatmentMedication: TreatmentMedication) {
		_.remove(this.newMedications, {id: treatmentMedication.id});
	}

	updateMedication(event) {
		this.newMedications.splice(event.index, 1, event.medication);
	}

	onAddNewBlankMedication() {
		let treatmentMedication = new TreatmentMedication();

		if (this.treatmentMedications.length > 1) {
			treatmentMedication = this.treatmentMedications[0];
		}

		if (this.newMedications.length < this.treatmentMedications.length) {
			this.newMedications.push(treatmentMedication);
		} else {
			this.errorMessage = 'MAX MEDICATIONS WARNING';

			setTimeout(() => {
				this.errorMessage = '';
			}, 3000)
		}
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

	private getTreatmentMedicines(): void {
		this.nsfo.doGetRequest(this.nsfo.URI_TREATMENT_MEDICINES + '?active_only=true')
			.pipe(takeUntil(this.onDestroy$))
			.subscribe(
				res => {
					this.treatmentMedications= <TreatmentMedication[]> res.result;
				}
			);
	}
}