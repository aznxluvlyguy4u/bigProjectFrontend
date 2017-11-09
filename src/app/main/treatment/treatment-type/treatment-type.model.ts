import { User } from '../../client/client.model';

export class TreatmentType {
	id: number;
	dutchType: string;
	description: string;
	type: string;
	is_active: boolean;
	log_date: string;
	creation_by: User;
	edited_by: User;
	deleted_by: User;
}