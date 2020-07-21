import { Location } from '../../client/client.model';
import { TreatmentType } from '../treatment-type/treatment-type.model';
import { User } from '../../client/client.model';
import {TreatmentMedication} from "../treatment-medication/treatment-medication.model";

export class TreatmentTemplate {
	id: number;
	location: Location;
	treatment_type: TreatmentType;
	description: string;
	treatment_medications: TreatmentMedication[];
	is_active: boolean;
	log_date: string;
	creation_by: User;
	edited_by: User;
	deleted_by: User;
	is_editable: boolean;
	type: string;
}