import { Person } from './person.model';

export class VwaEmployee extends Person {
	public last_login_date: string;
	public invitation_date: string;
}