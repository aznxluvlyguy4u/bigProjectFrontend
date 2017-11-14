import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MedicationOption } from '../medication-option.model';
import { TranslatePipe } from 'ng2-translate';

@Component({
	selector: 'app-medicine-form-entry',
	template: require('./medicine-form-entry.component.html'),
	pipes: [TranslatePipe]
})
export class MedicineFormEntryComponent {
	@Input() medicationOption: MedicationOption;
	@Input() isSaving: boolean;
	@Output() updateMedicationOption: EventEmitter<MedicationOption> = new EventEmitter<MedicationOption>();
	@Output() removeMedicationOption: EventEmitter<MedicationOption> = new EventEmitter<MedicationOption>();

	onEdit() {
		this.medicationOption.is_active = true;
		this.updateMedicationOption.emit(this.medicationOption);
	}

	onRemove() {
		this.medicationOption.is_active = false;
		this.removeMedicationOption.emit(this.medicationOption);
	}
}