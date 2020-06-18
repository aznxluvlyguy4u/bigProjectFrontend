import { Component, EventEmitter, Input, Output, AfterViewInit, OnInit } from '@angular/core';

import { TranslatePipe } from 'ng2-translate';
import {TreatmentMedication} from "../../treatment-medication/treatment-medication.model";
import _ = require("lodash");
import {UcFirstPipe} from "../../../../global/pipes/uc-first.pipe";

@Component({
	selector: 'app-medicine-form-entry',
	template: require('./medicine-form-entry.component.html'),
	pipes: [TranslatePipe, UcFirstPipe]
})
export class MedicineFormEntryComponent implements AfterViewInit{
	@Input() treatmentMedication: TreatmentMedication;
	@Input() treatmentMedicines: TreatmentMedication[];
	@Input() isSaving: boolean;
	@Input() isEdit: boolean;
	@Input() index;
	@Output() updateTreatmentMedication: EventEmitter<any> = new EventEmitter();
	@Output() removeTreatmentMedication: EventEmitter<TreatmentMedication> = new EventEmitter<TreatmentMedication>();

	public selectedTreatmentMedication: TreatmentMedication;

	private treatmentMedicationId;

	public editing: boolean;

	ngOnInit() {
		this.editing = this.isEdit;
		if (typeof this.treatmentMedication.is_active !== 'undefined') {
			this.editing = false;
		}
	}

	ngAfterViewInit() {
		setTimeout(() => {
			if (typeof this.treatmentMedication === 'undefined' && this.treatmentMedicines.length > 0) {
				this.treatmentMedicationId = this.treatmentMedicines[0].id;
			} else {
				this.treatmentMedicationId = this.treatmentMedication.id;
			}
		});
	}

	onEdit() {
		let treatmentMedicationIndex = _.findIndex(this.treatmentMedicines, {id: this.treatmentMedicationId});

		if (treatmentMedicationIndex >= 0) {
			this.treatmentMedication = this.treatmentMedicines[treatmentMedicationIndex];
		}

		this.treatmentMedication.is_active = true;

		this.updateTreatmentMedication.emit({medication: this.treatmentMedication, index: this.index});
	}

	onRemove() {
		this.treatmentMedication.is_active = false;
		this.removeTreatmentMedication.emit(this.treatmentMedication);
	}

	isDefined(val) {
		return typeof val !== 'undefined';
	}
}