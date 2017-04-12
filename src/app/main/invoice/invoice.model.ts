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
    public id: number;
    public description: string;
    public price_excl_vat: number;
    public vat_percentage_rate: number;
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