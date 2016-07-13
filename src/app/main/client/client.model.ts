export class Client {
    public client_id: number;
    public debtor_number: string;
    public company_name: string;
    public telephone_number: string;
    public company_relation_number: string;
    public vat_number: string;
    public chamber_of_commerce_number: string;
    public notes: string;
    public address: Address = new Address();
    public billing_address: Address = new Address();
    public locations: Location[] = [];
    public users: User[] = [];
}

export class Location {
    public ubn: string;
    public address: Address = new Address();
    public health: Health = new Health()
}

export class User {
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

