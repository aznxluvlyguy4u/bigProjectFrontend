import { TreatmentTemplate } from './treatment-template.model';
import {TreatmentMedicine} from "../treatment-medication/treatment-medication.model";

export class MedicationOption {
	id: number;
	treatment_template: TreatmentTemplate;
	treatment_medication: TreatmentMedicine;
	dosage: number;
	dosage_unit: string;
	waiting_days: number;
	reg_nl: string;
	is_active: boolean; // !note remove inactive MedicationOptions when sending them to the API
}