export class Invoice {
    public invoice_id: number;
    public invoice_number: string;
    public debtor_number: string;
    public ubn: string;
    public name: string;
    public subscription_date: string;
    public invoice_date: string;
    public status: string;
    public reminders: number;
    public rules: InvoiceRule[] = [];
}

export class InvoiceRule {
    public rule_id: string;
    public description: string;
    public price_excl_vat: number;
    public vat_rate: number;
}