export class TreatmentMedication {
	id: number;
	name: string;
	dosage: number;
	dosage_unit: string;
	reg_nl: string;
	treatment_duration: number;
	waiting_days: number;
	is_active: boolean;

	constructor() {
		this.id = 0;
		this.name = '';
		this.is_active = true;
	}
}