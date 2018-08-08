import { Animal } from '../components/livestock/livestock.model';
import { EditType } from './edit-type.model';
import { Person } from './person.model';
import { Location } from '../../main/client/client.model';

export class AnimalResidenceHistory {
	public id?: number;
	public log_date?: string;
	public start_date: string;
	public end_date?: string;
	public animal?: Animal;
	public location: Location;
	public is_pending?: boolean;
	public country?: string;
	public start_date_edit_type?: EditType;
	public start_date_edited_by?: Person;
	public end_date_edit_type?: EditType;
	public end_date_edited_by?: Person;
}