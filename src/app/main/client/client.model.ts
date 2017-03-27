export class Client {
    public company_id: number;
    public debtor_number: string;
    public company_name: string;
    public telephone_number: string;
    public company_relation_number: string;
    public vat_number: string;
    public chamber_of_commerce_number: string;
    public subscription_date: string;
    public animal_health_subscription: string | boolean;
    public status: boolean;
    public owner: User = new User();
    public unpaid_invoices: Invoice[] = [];
    public notes: ClientNote[] = [];
    public address: Address = new Address();
    public billing_address: Address = new Address();
    public locations: Location[] = [];
    public deleted_locations: Location[] = [];
    public users: User[] = [];
    public deleted_users: User[] = [];
    public pedigrees: Pedigree[] = [];
}

export class Location {
    public location_id: string;
    public ubn: string;
    public address: Address = new Address();
}

export class User {
    public person_id: number;
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

class Pedigree {
    public number: string;
}

export class ClientDetails {
    public company_id: number;
    public company_name: string;
    public telephone_number: string;
    public owner: User = new User();
    public status: string;
    public subscription_date: string;
    public livestock: LivestockStats = new LivestockStats();
    public address: Address = new Address();
    public breeder_numbers: BreederNumber[] = [];
    public invoices: Invoice[] = [];
    public animal_health: AnimalHealth[] = [];
    public users: User[] = [];
    public health_statusses: LocationHealthStatus[] = [];
}

export class LocationHealthStatus {
    public ubn: string;
    public maedi_visna_status: string;
    public maedi_visna_check_date: string;
    public scrapie_status: string;
    public scrapie_check_date: string;
    public cae_status: string;
    public cae_check_date: string;
    public cl_status: string;
    public cl_check_date: string;
    public reason_of_change: string;
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
    public neuter: AnimalStats = new AnimalStats();
}

class AnimalStats {
    public total: number;
    public less_6_months: number;
    public between_6_12_months: number;
    public greater_12_months: number;
}

export class ClientNote {
    public creation_date: string;
    public creator: User = new User();
    public message: string;
}

export const MAEDI_VISNA_STATUS_OPTIONS = [
    "FREE",
    "FREE 1 YEAR",
    "FREE 2 YEAR",
    "UNDER OBSERVATION",
    "UNDER INVESTIGATION",
    "STATUS KNOWN BY ANIMAL HEALTH DEPARTMENT"
];

export const SCRAPIE_STATUS_OPTIONS = [
    "FREE",
    "RESISTANT",
    "UNDER OBSERVATION",
    "UNDER INVESTIGATION"
];