import DateTimeFormat = Intl.DateTimeFormat;
import {Address, Client} from '../client/client.model';
import { LedgerCategory } from '../../global/models/ledger-category.model';

export class Invoice {
    public id: number;
    public invoice_number: string;
    public invoice_date: Date;
    public paid_date: Date;
    public company_address_street_name: string;
    public company_address_street_number: number;
    public company_address_street_number_suffix: string;
    public company_address_postal_code: string;
    public company_address_city: string;
    public company_address_state: string;
    public company_address_country: string;
    public company: Client;
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
    public invoice_rule_selections: InvoiceRuleSelection[] = [];
    public total: number;
    public pdf_url: string;
    public ledger_account_number: string;
    public vat_breakdown: VatBreakdown;
    public mollie_id: string;
    public is_batch: boolean;
}

export class InvoiceRule {
    public id: number;
    public description: string;
    public vat_percentage_rate: number;
    public price_excl_vat: number;
    public sort_order: number;
    public type: string;
    ledger_category: LedgerCategory;
    invoice_rule_selections: InvoiceRuleSelection[] = [];
}

export class InvoiceRuleSelection {
    id: number;
    invoice: Invoice;
    invoice_rule: InvoiceRule;
    date: Date;
    amount: number;
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

export class VatBreakdown {
	total_excl_vat: number;
	total_incl_vat: number;
	vat: number;
	records: VatBreakdownRecord[] = [];
}

export class VatBreakdownRecord {
	vat_percentage_rate: number;
	price_excl_vat_total: number;
	vat: number;
}