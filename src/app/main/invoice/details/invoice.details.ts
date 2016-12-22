var _ = require('lodash');
import {Component} from "@angular/core";
import {Subscription} from "rxjs/Rx";
import {Router, ActivatedRoute} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {InvoiceRule, Invoice} from "../invoice.model";

@Component({
    template: require('./invoice.details.html'),
    pipes: [TranslatePipe]
})

export class InvoiceDetailsComponent {
    private dataSub: Subscription;
    private pageTitle: string;
    private pageMode: string;
    private invoiceId: string;
    private selectedInvoiceId: string = '';
    private invoiceRulesOptions: InvoiceRule[] = [];
    
    private invoice: Invoice = new Invoice;
    
    private totalExclVAT: number = 0;
    private totalInclVAT: number = 0;
    private vatCalculations = [];

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private nsfo: NSFOService) {
        this.getInvoiceRulesOptions();
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
        this.nsfo.doGetRequest(this.nsfo.URI_SETTINGS + '/invoice-rules')
            .subscribe(
                res => {
                    this.invoiceRulesOptions = <InvoiceRule[]> res.result;
                }
            )
    }
    
    private addInvoiceRule(): void {
        if (this.selectedInvoiceId) {
            console.log(this.selectedInvoiceId);

            let invoiceRule = _.find(this.invoiceRulesOptions, function(o) {
                return o.id == this.selectedInvoiceId
            });

            console.log(invoiceRule);

            this.invoice.rules.push(invoiceRule);
            console.log(this.invoice.rules);
            this.doVATCalculations();
        }
    }

    private removeInvoiceRule(invoiceRule: InvoiceRule): void {
        let index = this.invoice.rules.indexOf(invoiceRule);
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
        console.log(this.vatCalculations);
    }
}