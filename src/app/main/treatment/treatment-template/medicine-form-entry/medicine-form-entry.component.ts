import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MedicationOption } from '../medication-option.model';
import { TranslatePipe } from 'ng2-translate';
import {TreatmentMedicine} from "../../treatment-medicines/treatment-medicine.model";

@Component({
	selector: 'app-medicine-form-entry',
	template: require('./medicine-form-entry.component.html'),
	pipes: [TranslatePipe]
})
export class MedicineFormEntryComponent {
	@Input() medicationOption: MedicationOption;
	@Input() treatmentMedicines: TreatmentMedicine[];
	@Input() isSaving: boolean;
	@Output() updateMedicationOption: EventEmitter<MedicationOption> = new EventEmitter<MedicationOption>();
	@Output() removeMedicationOption: EventEmitter<MedicationOption> = new EventEmitter<MedicationOption>();

	private treatment_medicine: TreatmentMedicine;

	onEdit(event = null, eventType = null) {
		this.medicationOption.is_active = true;
		if (event !== null && eventType !== null) {
			this.medicationOption[eventType] = event;
		}
		console.log(this.medicationOption);
		this.updateMedicationOption.emit(this.medicationOption);
	}

	onRemove() {
		this.medicationOption.is_active = false;
		this.removeMedicationOption.emit(this.medicationOption);
	}


}