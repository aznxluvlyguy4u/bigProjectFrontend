import { Invoice } from '../invoice/invoice.model';
import { Person } from '../../global/models/person.model';
import { PedigreeRegisterRegistration } from '../../global/models/pedigree-register-registration.model';
import { Country } from '../../global/models/country.model';

export class Client {
	  public id: number;
    public company_id: string;
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
    public locations_details: LocationDetails[] = [];
    public deleted_locations: Location[] = [];
    public users: User[] = [];
    public deleted_users: User[] = [];
    public twinfield_administration_code: string;
    public twinfield_code: number;
    public invoices: Invoice[] = [];
}

export class Location {
	public id ?: number;
    public location_id ?: string;
    public ubn: string;
    public address ?: Address = new Address();
    public is_active ?: boolean;
	public location_holder ?: string;
    public company ?: Client;
    public pedigree_register_registrations ?: PedigreeRegisterRegistration[] = [];
}

export class LocationDetails {
    public ubn: string;
    public country_details: Country;
}


export class NestedAnnouncementLocationOutput extends Location {
    first_name: string;
    last_name: string;
    livestock_count: number;
}

export class User extends Person {
    public primary_contactperson ?: string | boolean;
    public relation_number_keeper ?: string;
    public companies ?: Client[]
}

export class ActionLog {
    public log_date: string;
    public user_account: User;
    public action_by: User;
    public user_action_type: string;
    public description: string;
    public is_completed: boolean;
    public is_user_environment: boolean;
    public is_vwa_environment: boolean;
    public is_rvo_message: boolean;
}

export class Address {
    public street_name: string;
    public address_number: number;
    public address_number_suffix: string;
    public suffix: string; // WARNING 'suffix' is indirectly linked to address_number_suffix in API
    public postal_code: string;
    public city: string;
    public state: string;
    public country: string;
}

export class GhostLoginDetails {
	public owner: User = new User();
	public users: User[] = [];
}

export class GhostLoginDetailsWithUbn extends GhostLoginDetails {
	public ubn: string;
	public is_active: boolean;
	public has_ghost_login: boolean;
}

export class ClientDetails extends GhostLoginDetails {
    public company_id: number;
    public company_name: string;
    public telephone_number: string;
    public status: string;
    public subscription_date: string;
    public livestock: LivestockStats = new LivestockStats();
    public address: Address = new Address();
    public breeder_numbers: BreederNumber[] = [];
    public invoices: Invoice[] = [];
    public animal_health: AnimalHealth[] = [];
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
    public scrapie_reason_of_edit: string;
    public maedi_visna_reason_of_edit: string;
	  public cl_reason_of_edit: string;
	  public cae_reason_of_edit: string;
	  public animal_health_subscription: boolean;
}

class BreederNumber {
    public pedigree_register_abbreviation: string;
    public breeder_number: string;
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

export class QueryParam {
    public key: string;
    public value: any;
}

export class TwinfieldOffice {
    public name: string;
    public countryCode: string;
    public code: string;
}

export class TwinfieldCustomer {
    public code: string;
}

export const MAEDI_VISNA_STATUS_OPTIONS = [
    "BLANK",
    "FREE",
    "FREE 1 YEAR",
    "FREE 2 YEAR",
    "UNDER OBSERVATION",
    "UNDER INVESTIGATION",
    "STATUS KNOWN BY ANIMAL HEALTH DEPARTMENT",
    "STATUS KNOWN BY AHD"
];

export const SCRAPIE_STATUS_OPTIONS = [
    "BLANK",
    "RESISTANT",
    "UNDER OBSERVATION",
    "UNDER INVESTIGATION"
];