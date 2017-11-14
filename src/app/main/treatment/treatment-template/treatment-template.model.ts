import { Location } from '../../client/client.model';
import { MedicationOption } from './medication-option.model';
import { TreatmentType } from '../treatment-type/treatment-type.model';
import { User } from '../../client/client.model';

export class TreatmentTemplate {
	id: number;
	location: Location;
	treatment_type: TreatmentType;
	description: string;
	medications: MedicationOption[];
	is_active: boolean;
	log_date: string;
	creation_by: User;
	edited_by: User;
	deleted_by: User;
	type: string;
}