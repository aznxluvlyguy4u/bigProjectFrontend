
export interface Client {
    client_id: string;
    ubn: string;
    debtor_number: string;
    last_name: string;
    place: string;
    subscription_date: string;
    animal_health: string;
    pedigree_list: string[];
    unpaid_invoices: number;
    status: string;
}
