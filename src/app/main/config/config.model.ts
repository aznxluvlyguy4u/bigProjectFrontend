import { Address } from '../client/client.model';

export class Choice {
    public code: string;
    public name: string;
    public order: string;
}

export class Person {
	public person_id: number;
	public prefix: string;
	public first_name: string;
	public last_name: string;
	public email_address: string;
	public is_active: boolean;
	public type: string;
}

export class Admin extends Person {
    public access_level: string;
}

export class VwaEmployee extends Person {
	public last_login_date: string;
	public invitation_date: string;
}

export class HealthLetter {
    public log_date: string;
    public html: string;
    public revision_number: string;
    public last_name: string;
    public first_name: string;
}

export class InvoiceRuleTemplate {
    public id: number;
    public description: string;
    public vat_percentage_rate: number;
    public price_excl_vat: number;
    public sort_order: number;
    public category: string;
    public type: string;
}

export class InvoiceSenderDetails {
    public id: number;
    public name: string;
    public address: Address;
    public chamber_of_commerce_number: string;
    public vat_number: string;
    public iban: string;
    public payment_deadline_in_days: number;
    public is_deleted: boolean;
}