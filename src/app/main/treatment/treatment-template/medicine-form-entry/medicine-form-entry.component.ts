import { Component, EventEmitter, Input, Output, AfterViewChecked, AfterViewInit, OnInit } from '@angular/core';
import { MedicationOption } from '../medication-option.model';
import { TranslatePipe } from 'ng2-translate';
import {TreatmentMedication} from "../../treatment-medication/treatment-medication.model";
import _ = require("lodash");

@Component({
	selector: 'app-medicine-form-entry',
	template: require('./medicine-form-entry.component.html'),
	pipes: [TranslatePipe]
})
export class MedicineFormEntryComponent implements AfterViewInit{
	@Input() medicationOption: MedicationOption;
	@Input() treatmentMedicines: TreatmentMedication[];
	@Input() isSaving: boolean;
	@Output() updateMedicationOption: EventEmitter<MedicationOption> = new EventEmitter<MedicationOption>();
	@Output() removeMedicationOption: EventEmitter<MedicationOption> = new EventEmitter<MedicationOption>();

	private treatmentMedicationId;

	ngAfterViewInit() {
		setTimeout(() => {
			if (typeof this.medicationOption.treatment_medication === 'undefined' && this.treatmentMedicines.length > 0) {
				this.treatmentMedicationId = this.treatmentMedicines[0].id;
			} else {
				this.treatmentMedicationId = this.medicationOption.treatment_medication.id;
			}
		});
	}

	onEdit() {
		let treatmentMedicationIndex = _.findIndex(this.treatmentMedicines, {id: this.treatmentMedicationId});
		if (treatmentMedicationIndex >= 0) {
			this.medicationOption.treatment_medication = this.treatmentMedicines[treatmentMedicationIndex];
		}

		this.medicationOption.is_active = true;

		this.updateMedicationOption.emit(this.medicationOption);
	}

	onRemove() {
		this.medicationOption.is_active = false;
		this.removeMedicationOption.emit(this.medicationOption);
	}

	isDefined(val) {
		return typeof val !== 'undefined';
	}
}