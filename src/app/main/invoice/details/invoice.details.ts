import _ from "lodash";
import {Component} from "@angular/core";
import {Subscription} from "rxjs/Rx";
import {Router, ActivatedRoute} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {InvoiceRule, Invoice} from "../invoice.model";

@Component({
    templateUrl: '/app/main/invoice/details/invoice.details.html',
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

    ngOnChange(){
        console.log(this.selectedInvoiceId);
    }
    private getInvoiceRulesOptions(): void {
        this.nsfo.doGetInvoiceRules()
            .subscribe(
                res => {
                    this.invoiceRulesOptions = <InvoiceRule[]> res.result;
                }
            )
    }
    
    private addInvoiceRule(): void {
        let invoiceRule = _.find(this.invoiceRulesOptions, {'rule_id': this.selectedInvoiceId});
        this.invoice.rules.push(invoiceRule);
    }

    private removeInvoiceRule(invoiceRule: InvoiceRule): void {
        let index = this.invoice.rules.indexOf(invoiceRule);
        this.invoice.rules.splice(index, 1);
    }
}