export class Choice {
    public code: string;
    public name: string;
    public order: string;
}

export class Admin {
    public person_id: number;
    public email_address: string;
    public first_name: string;
    public last_name: string;
    public access_level: string;
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

export class Address {
    public street_name: string;
    public address_number: string;
    public address_number_suffix: string;
    public postal_code: string;
    public city: string;
    public state: string;
    public country: string;
}

export class VwaEmployee {
    public person_id: number;
    public email_address: string;
    public first_name: string;
    public last_name: string;
    public is_active: boolean;
    public last_login_date: string;
    public invitation_date: string;
}