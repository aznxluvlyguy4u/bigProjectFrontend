var _ = require('lodash');
import {Component} from "@angular/core";
import {Subscription} from "rxjs/Rx";
import {Router, ActivatedRoute, ROUTER_DIRECTIVES} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES, Validators} from "@angular/forms";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {InvoiceRuleTemplate, Invoice, InvoiceRule} from "../invoice.model";


@Component({
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
    template: require('./invoice.details.html'),
    pipes: [TranslatePipe]
})

export class InvoiceDetailsComponent {
    private dataSub: Subscription;
    private pageTitle: string;
    private pageMode: string;
    private invoiceId: string;
    private selectedInvoiceId: string = '';
    private invoiceRuleTemplatesOptions: InvoiceRuleTemplate[] = [];
    private temporaryRule = new InvoiceRuleTemplate();
    private invoice: Invoice = new Invoice;
    private form: FormGroup;

    private totalExclVAT: number = 0;
    private totalInclVAT: number = 0;
    private vatCalculations = [];

    constructor( private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private nsfo: NSFOService) {
        this.getInvoiceRulesOptions();
        this.form = fb.group({
            description: ['', Validators.required],
            price_excl_vat: ['', Validators.required],
            vat_percentage_rate: ['', Validators.required],
        });
    }

    ngOnInit() {
        this.dataSub = this.activatedRoute.params.subscribe(params => {
            this.pageMode = params['mode'];

            if(this.pageMode == 'edit') {
                this.pageTitle = 'EDIT INVOICE';
                this.invoiceId = params['id'];
            }

            if(this.pageMode == 'new') {
                this.pageTitle = 'NEW INVOICE';
            }
        });
    }

    private getInvoiceRulesOptions(): void {
        this.nsfo.doGetRequest(this.nsfo.URI_INVOICE_RULE_TEMPLATE)
            .subscribe(
                res => {
                    this.invoiceRuleTemplatesOptions = <InvoiceRuleTemplate[]> res.result;
                }
            )
    }
    
    private addInvoiceRule(): void {
            this.invoice.rules.push(this.temporaryRule);
            this.doVATCalculations();
            this.temporaryRule = new InvoiceRuleTemplate();
    }

    private addInvoiceRuleTemplate(): void {
        if (this.selectedInvoiceId) {
            let invoiceRule = _.find(this.invoiceRuleTemplatesOptions, function(o) {
                return o.id == this.selectedInvoiceId
            });

            this.invoice.rules.push(invoiceRule);
            this.doVATCalculations();
        }
    }

    private removeInvoiceRule(invoiceRule: InvoiceRule): void {
        let index = this.invoice.rules.indexOf(invoiceRule);
        this.invoice.rules.splice(index, 1);
        this.doVATCalculations();
    }

    private removeInvoiceRuleTemplate(invoiceRuleTemplate: InvoiceRuleTemplate): void {
        let index = this.invoice.rules.indexOf(invoiceRuleTemplate);
        this.invoice.rules.splice(index, 1);
        this.doVATCalculations();
    }

    private doVATCalculations(): void {
        this.vatCalculations = [];
        this.totalExclVAT = 0;
        this.totalInclVAT = 0;

        let calculations = [];
        let categories = _.uniqBy(this.invoice.rules, 'vat_percentage_rate');
        for(let category of categories) {
            let filteredArray = _.filter(this.invoice.rules, {'vat_percentage_rate': category.vat_percentage_rate});
            calculations.push(filteredArray);
        }

        for(let group of calculations) {

            let totalAmount = 0;
            let vat_percentage_rate = 0;

            for(let single of group) {
                this.totalExclVAT += single.price_excl_vat;
                totalAmount += single.price_excl_vat;
                vat_percentage_rate = single.vat_percentage_rate;
            }

            let calculation = {
                category: vat_percentage_rate,
                amount: totalAmount,
                total: (totalAmount/100) * vat_percentage_rate
            };
            this.totalInclVAT += (totalAmount/100) * vat_percentage_rate;
            this.vatCalculations.push(calculation);


        }

        this.totalInclVAT += this.totalExclVAT;
    }
}