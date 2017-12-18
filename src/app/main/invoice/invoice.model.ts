import DateTimeFormat = Intl.DateTimeFormat;
export class Invoice {
    public id: number;
    public invoice_number: string;
    public invoice_date: Date;
    public company: Company;
    public company_name: string;
    public company_vat_number: string;
    public company_id: string;
    public company_debtor_number: string;
    public sender_details: InvoiceSenderDetails;
    public ubn: string;
    public name: string;
    public subscription_date: string;
    public status: string;
    public reminders: number;
    public invoice_rules: InvoiceRule[] = [];
    public total: number;
}

export class InvoiceRuleTemplate {
    public id: number;
    public description: string;
    public price_excl_vat: number;
    public vat_percentage_rate: number;
}

export class InvoiceRule {
    public id: number;
    public description: string;
    public vat_percentage_rate: number;
    public price_excl_vat: number;
    public sort_order: number;
    public category: string;
    public type: string;
}

export class Company {
    public id: number;
    public company_id: string;
    public locations: Local_Location[] = [];
    public vat_number: string;
    public company_name: string;
    public debtor_number: string;
    public owner: User;
    public address: Address;
    public invoices: Invoice[] = [];
}

export class Local_Location {
    public id: number;
    public location_id: number;
    public ubn: string;
    public is_active: boolean;
    public location_holder: string;
    public location_address: Address;
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

export class User {
    public person_id: number;
    public prefix: string;
    public last_name: string;
    public first_name: string;
    public email_address: string;
    public type: string;
    public is_active: boolean;
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