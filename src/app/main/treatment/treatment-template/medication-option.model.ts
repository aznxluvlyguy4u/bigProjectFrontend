import { TreatmentTemplate } from './treatment-template.model';
import {TreatmentMedication} from "../treatment-medication/treatment-medication.model";

export class MedicationOption {
	id: number;
	treatment_template: TreatmentTemplate;
	treatment_medication: TreatmentMedication;
	// dosage: number;
	// dosage_unit: string;
	// reg_nl: string;
	// waiting_days: number;
	// treatment_duration: string;
	// is_active: boolean; // !note remove inactive MedicationOptions when sending them to the API
}