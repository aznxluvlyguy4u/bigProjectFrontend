import { TreatmentTemplate } from './treatment-template.model';
import {TreatmentMedication} from "../treatment-medication/treatment-medication.model";

export class MedicationOption {
	id: number;
	treatment_template: TreatmentTemplate;
	treatment_medication: TreatmentMedication;
}