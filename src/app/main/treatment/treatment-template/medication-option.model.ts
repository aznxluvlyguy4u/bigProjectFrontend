import { TreatmentTemplate } from './treatment-template.model';

export class MedicationOption {
	id: number;
	treatment_template: TreatmentTemplate;
	description: string;
	dosage: number;
	is_active: boolean; // !note remove inactive MedicationOptions when sending them to the API
}