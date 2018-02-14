import _ = require('lodash');
import {Component} from "@angular/core";
import {Subscription} from "rxjs/Rx";
import {Router, ActivatedRoute, ROUTER_DIRECTIVES} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES, Validators} from "@angular/forms";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import { InvoiceRuleTemplate, Invoice, InvoiceSenderDetails, InvoiceRule } from "../invoice.model";
import { CompanySelectorComponent } from '../../../global/components/clientselector/company-selector.component';
import { Address, Client } from '../../client/client.model';

@Component({
    selector: 'ng-select',
    properties: [
        'allowClear',
        'placeholder',
        'items',
        'multiple',
        'showSearchInputInDropdown'
    ],
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, CompanySelectorComponent],
    template: require('./invoice.details.html'),
    pipes: [TranslatePipe]
})

export class InvoiceDetailsComponent {
    private dataSub: Subscription;
    private senderDetails: InvoiceSenderDetails = new InvoiceSenderDetails();
    private pageTitle: string;
    private pageMode: string;
    private invoiceId: string;
    private selectedUbn: string;
    private selectedCompany: Client;
    private selectedInvoiceRuleId: number;
    private standardGeneralInvoiceRuleOptions: InvoiceRule[] = [];
    private standardAnimalHealthInvoiceRuleOptions: InvoiceRule[] = [];
    private temporaryRule: InvoiceRule = new InvoiceRule();
    private invoice: Invoice = new Invoice;
    private form: FormGroup;
    private onlyView: boolean = false;
    private totalExclVAT: number = 0;
    private totalInclVAT: number = 0;
    private vatCalculations = [];

    constructor(private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private nsfo: NSFOService) {
        this.form = fb.group({
            description: ['', Validators.required],
            category: ['', Validators.required],
            price_excl_vat: ['', Validators.required],
            vat_percentage_rate: ['', Validators.required],
        });
    }

    ngOnInit() {
        this.getGeneralInvoiceRulesOptions();
        this.getAnimalHealthInvoiceRulesOptions();
        this.getSenderDetails();
        this.dataSub = this.activatedRoute.params.subscribe(params => {
            this.pageMode = params['mode'];
            if(this.pageMode == 'edit') {
                this.pageTitle = 'EDIT INVOICE';
                this.invoiceId = params['id'];
                this.nsfo.doGetRequest(this.nsfo.URI_INVOICE + "/" + this.invoiceId)
                    .subscribe(res => {
                        this.invoice = res.result;
                        this.invoice.invoice_rules = res.result['invoice_rules'];
											  this.selectedCompany = this.invoice.company;
											  this.selectedUbn = this.invoice.ubn;
                        this.doVATCalculations();
                    });
            }

            if(this.pageMode == 'new') {
                this.pageTitle = 'NEW INVOICE';
                this.invoice.status = "INCOMPLETE";
							  this.selectedCompany = null;
							  this.selectedUbn = null;
                this.nsfo.doPostRequest(this.nsfo.URI_INVOICE, this.invoice)
                    .subscribe(
                        res => {
                            this.invoice = res.result;
                            this.invoice.invoice_number = res.result['invoice_number'];
													  this.selectedCompany = this.invoice.company;
													  this.selectedUbn = this.invoice.ubn;
                        }
                    );
            }

            if (this.pageMode == "view") {
                this.pageTitle = 'VIEW INVOICE';
                this.invoiceId = params['id'];
                this.nsfo.doGetRequest(this.nsfo.URI_INVOICE + "/" + this.invoiceId)
                    .subscribe(res => {
                        this.invoice = res.result;
                        this.senderDetails = this.invoice['sender_details'];
											  this.selectedCompany = this.invoice.company;
											  this.invoice.sender_details = this.senderDetails;
											  this.selectedUbn = this.invoice.ubn;
                        this.invoice.invoice_rules = res.result['invoice_rules'];
                        this.doVATCalculations();
                    });
                this.onlyView = true;
            }
        });
    }

    private getGeneralInvoiceRulesOptions(): void {
        this.nsfo.doGetRequest(this.nsfo.URI_INVOICE_RULE + "?category=GENERAL&type=standard")
            .subscribe(
                res => {
                    this.standardGeneralInvoiceRuleOptions = <InvoiceRule[]> res.result;
                }
            )
    }

    private getAnimalHealthInvoiceRulesOptions(): void {
        this.nsfo.doGetRequest(this.nsfo.URI_INVOICE_RULE + "?category=ANIMAL HEALTH&type=standard")
            .subscribe(
                res => {
                    this.standardAnimalHealthInvoiceRuleOptions = <InvoiceRule[]> res.result;
                }
            )
    }
    
    private addInvoiceRule(type, category): void {
        let rule = new InvoiceRule();
        rule.type = "custom";
        rule.sort_order = 1;
        if (type == "standard") {
            let selectedId = this.selectedInvoiceRuleId;
            if (this.selectedInvoiceRuleId) {
                let standardInvoiceRule = _.find(this.standardGeneralInvoiceRuleOptions, function (o) {
                    return o.id == selectedId;
                });
                if (category == "ANIMAL HEALTH") {
                    standardInvoiceRule = _.find(this.standardAnimalHealthInvoiceRuleOptions, function (o) {
                        return o.id == selectedId;
                    });
                }
                rule.description = standardInvoiceRule.description;
                rule.vat_percentage_rate = standardInvoiceRule.vat_percentage_rate;
                rule.price_excl_vat = standardInvoiceRule.price_excl_vat;
                rule.category = standardInvoiceRule.category;
                this.addCustomInvoiceRule(rule, type);
            }
        } else {
            rule.sort_order = 1;
            rule.category = this.temporaryRule.category;
            rule.vat_percentage_rate = this.temporaryRule.vat_percentage_rate;
            rule.price_excl_vat = this.temporaryRule.price_excl_vat;
            rule.description = this.temporaryRule.description;
            this.addCustomInvoiceRule(rule, type);
        }
        this.doVATCalculations();
    }

    private removeInvoiceRule(invoiceRule: InvoiceRule): void {
        let index = this.invoice.invoice_rules.indexOf(invoiceRule);
        this.deleteCustomInvoiceRule(this.invoice.invoice_rules[index].id);
        this.invoice.invoice_rules.splice(index, 1);
        this.doVATCalculations();
    }

    private doVATCalculations(): void {
        this.vatCalculations = [];
        this.totalExclVAT = 0;
        this.totalInclVAT = 0;

        let calculations = [];
        let categories = _.uniqBy(this.invoice.invoice_rules, 'vat_percentage_rate');
        for(let category of categories) {
            let filteredArray = _.filter(this.invoice.invoice_rules, {'vat_percentage_rate': category.vat_percentage_rate});
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
        this.invoice.total = this.totalInclVAT;
    }

    private addCustomInvoiceRule(newRule: InvoiceRule, type: String){
        this.nsfo
            .doPostRequest(this.nsfo.URI_INVOICE+ "/" + this.invoice.id + "/invoice-rules", newRule)
            .subscribe(
                res => {
                    if (type !== "standard") {
                        this.temporaryRule = new InvoiceRule();
                    }
                    this.invoice.invoice_rules.push(res.result);
                    this.doVATCalculations();
                }
            );
    }

    private updateCustomInvoiceRule(){

    }

    private deleteCustomInvoiceRule(id: number){
        this.nsfo
            .doDeleteRequest(this.nsfo.URI_INVOICE + "/" + this.invoice.id + "/invoice-rules" + "/" + id.toString(), "")
            .subscribe(
                res => {
                }
            );
    }

    setInvoiceRecipient() {
        if (this.selectedCompany) {
					this.invoice.company = this.selectedCompany;
					this.invoice.company_id = this.selectedCompany.company_id;
					this.invoice.company_name = this.selectedCompany.company_name;
					this.invoice.company_vat_number = this.selectedCompany.vat_number;
					this.invoice.company_debtor_number = this.selectedCompany.debtor_number;

					if (this.selectedCompany.owner) {
					    const firstName = this.selectedCompany.owner.first_name != null && this.selectedCompany.owner.first_name != ''
                ? this.selectedCompany.owner.first_name + ' ' : '';
					    this.invoice.name = firstName + this.selectedCompany.owner.last_name;
          } else {
					    this.invoice.name = null;
          }

          // Remove selectedUbn if the old selectedUbn does not belong to the new selectedCompany
          if (this.selectedCompany.locations) {
					      let hasSelectedUbn = false;
						    for (let location of this.selectedCompany.locations) {
						        if (typeof location === 'string') {
						            if (location === this.selectedUbn) {
						                hasSelectedUbn = true;
						                break;
                        }
                    } else {
						            if (location.ubn != null && location.ubn === this.selectedUbn) {
						                hasSelectedUbn = true;
						                break;
                        }
                    }
                }
                if (!hasSelectedUbn) {
						        this.selectedUbn = null;
                }

          } else {
					    this.selectedUbn = null;
          }

        } else {
					this.invoice.company = null;
					this.invoice.company_id = null;
					this.invoice.company_name = null;
					this.invoice.company_vat_number = null;
					this.invoice.company_debtor_number = null;
					this.selectedUbn = null;
        }

        this.setInvoiceUbn();
    }

    setInvoiceUbn() {
			if (this.selectedUbn == null || this.selectedUbn == '' || this.selectedUbn == 'null') {
			  this.selectedUbn = null;
				this.invoice.ubn = null;
			} else {
				this.invoice.ubn = this.selectedUbn;
			}
    }

    private getSenderDetails() {
        let details = new InvoiceSenderDetails();
        let address = new Address();
        this.nsfo.doGetRequest(this.nsfo.URI_INVOICE_SENDER_DETAILS)
            .subscribe(
                res => {
                    details = res.result;
                    if(details != undefined) {
                        this.senderDetails = res.result;
                        address = res.result.address;
                        this.senderDetails.address = address;
                    }
                }
            );
    }

    private sendInvoiceToClient() {
        this.invoice.sender_details = this.senderDetails;
        this.invoice.status = "UNPAID";
        this.invoice.total = this.totalInclVAT;
        if (this.invoice.id) {
            this.nsfo.doPutRequest(this.nsfo.URI_INVOICE + "/" + this.invoice.id ,this.invoice)
                .subscribe(
                    res => {
                        this.navigateTo("/invoice");
                    }
                );
        }
        else {
            this.nsfo.doPostRequest(this.nsfo.URI_INVOICE, this.invoice)
                .subscribe(
                    res => {
                        this.navigateTo("/invoice");
                    }
                );
        }
    }

    private saveInvoice() {
        this.invoice.sender_details = this.senderDetails;
        this.invoice.status = "NOT SEND";
        this.invoice.total = this.totalInclVAT;
        if (!this.invoice.company_name) {
            this.invoice.status = "INCOMPLETE";
        }
        if (this.pageMode == 'edit') {
            this.nsfo.doPutRequest(this.nsfo.URI_INVOICE + "/" + this.invoice.id, this.invoice)
                .subscribe(
                    res => {
                        this.navigateTo("/invoice");
                    }
                );
        }
        else {
            this.nsfo.doPostRequest(this.nsfo.URI_INVOICE, this.invoice)
                .subscribe(
                    res => {
                        this.navigateTo("/invoice");
                    }
                );
        }
    }

    private deleteInvoice() {
        this.nsfo.doDeleteRequest(this.nsfo.URI_INVOICE + "/" + this.invoiceId, this.invoice)
            .subscribe(
                res => {
                    this.navigateTo("/invoice");
                }
            )
    }

    private navigateTo(url: string) {
        this.router.navigate([url]);
    }
}