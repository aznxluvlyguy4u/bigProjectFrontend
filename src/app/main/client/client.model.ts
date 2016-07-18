export class Client {
    public client_id: number;
    public debtor_number: string;
    public company_name: string;
    public telephone_number: string;
    public company_relation_number: string;
    public vat_number: string;
    public chamber_of_commerce_number: string;
    public subscription_date: string;
    public unpaid_invoices: number;
    public notes: string;
    public address: Address = new Address();
    public billing_address: Address = new Address();
    public locations: Location[] = [];
    public users: User[] = [];
    public pedigrees: Pedigree[] = [];
}

export class Location {
    public ubn: string;
    public address: Address = new Address();
    public health: Health = new Health()
}

export class User {
    public prefix: string;
    public last_name: string;
    public first_name: string;
    public email_address: string;
    public primary_contactperson: string | boolean;
}

class Address {
    public street_name: string;
    public address_number: string;
    public suffix: string;
    public postal_code: string;
    public city: string;
    public state: string;
    public country: string;
}

class Health {
    public animal_health: string | boolean;
    public disease: string;
    public date_since: string;
    public date_till: string;
    public health_status: string;
    public health_statement: File;
    public own_health_statement: string | boolean;
}

class Pedigree {
    public number: string;
}

export class ClientDetails {
    public client_id: number;
    public company_name: string;
    public telephone_number: string;
    public primary_contactperson: User = new User();
    public status: string;
    public subscription_date: string;
    public livestock: LivestockStats = new LivestockStats();
    public address: Address = new Address();
    public breeder_numbers: BreederNumber[] = [];
    public invoices: Invoice[] = [];
    public animal_health: AnimalHealth[] = [];
}

class BreederNumber {
    public code: string;
    public number: string;
}

class Invoice {
    public invoice_number: string;
    public invoice_date: string;
    public status: string;
    public pdf_url: string;
}

class AnimalHealth {
    public ubn: string;
    public name: string;
    public inspection: string;
    public request_date: string;
    public directions: Direction[] = [];
    public total_lead_time: string;
    public authorized_by: string;
}

class Direction {
    public type: string;
    public date: string;
}

class LivestockStats {
    public ram: AnimalStats = new AnimalStats();
    public ewe: AnimalStats = new AnimalStats();
}

class AnimalStats {
    public total: number;
    public less_6_months: number;
    public between_6_12_months: number;
    public greater_12_months: number;
}

export class ClientNote {
    public creation_date: string;
    public created_by: string;
    public message: string;
}