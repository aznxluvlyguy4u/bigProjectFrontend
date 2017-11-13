import { TreatmentTemplate } from './treatment-template.model';

export class MedicationOption {
	id: number;
	treatment_template: TreatmentTemplate;
	description: string;
	dosage: number;
}