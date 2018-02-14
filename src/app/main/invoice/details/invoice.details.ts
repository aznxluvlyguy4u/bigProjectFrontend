var _ = require('lodash');
import {Component} from "@angular/core";
import {Subscription} from "rxjs/Rx";
import {Router, ActivatedRoute, ROUTER_DIRECTIVES} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES, Validators} from "@angular/forms";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {
    InvoiceRuleTemplate, Invoice, Company, Local_Location, InvoiceSenderDetails, Address,
    InvoiceRule
} from "../invoice.model";

@Component({
    selector: 'ng-select',
    properties: [
        'allowClear',
        'placeholder',
        'items',
        'multiple',
        'showSearchInputInDropdown'
    ],
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
    template: require('./invoice.details.html'),
    pipes: [TranslatePipe]
})

export class InvoiceDetailsComponent {
    private dataSub: Subscription;
    private companies: Company[] = [];
    private locations: Local_Location[] = [];
    private senderDetails: InvoiceSenderDetails = new InvoiceSenderDetails();
    private pageTitle: string;
    private pageMode: string;
    private invoiceId: string;
    private selectedCompany: Company = new Company();
    private selectedLocation: Local_Location = new Local_Location();
    private selectedInvoiceRuleId: number;
    private standardGeneralInvoiceRuleOptions: InvoiceRule[] = [];
    private standardAnimalHealthInvoiceRuleOptions: InvoiceRule[] = [];
    private temporaryRule: InvoiceRule = new InvoiceRule();
    private companyName: string = "";
    private invoice: Invoice = new Invoice;
    private form: FormGroup;
    private company: FormGroup;
    private showCompanies: boolean = false;
    private showLocations: boolean = false;
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
                        this.doVATCalculations();
                    });
            }

            if(this.pageMode == 'new') {
                this.pageTitle = 'NEW INVOICE';
                this.invoice.status = "INCOMPLETE";
                this.nsfo.doPostRequest(this.nsfo.URI_INVOICE, this.invoice)
                    .subscribe(
                        res => {
                            this.invoice = res.result;
                            this.invoice.invoice_number = res.result['invoice_number'];
                        }
                    )
            }

            if (this.pageMode == "view") {
                this.pageTitle = 'VIEW INVOICE';
                this.invoiceId = params['id'];
                this.nsfo.doGetRequest(this.nsfo.URI_INVOICE + "/" + this.invoiceId)
                    .subscribe(res => {
                        this.invoice = res.result;
                        this.senderDetails = this.invoice['sender_details'];
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

    private getClients(){
        this.nsfo
            .doGetRequest(this.nsfo.URI_COMPANIES_INVOICE)
            .subscribe(
                res => {
                    this.companies = res.result;
                    this.showLocations = true;
                }
            );
    }

    private searchCompanies() {
        this.showCompanies = false;
        this.nsfo.doGetRequest(this.nsfo.URI_CLIENTS + "/company/name?company_name=" + this.companyName)
            .subscribe(
                res => {
                    this.companies = res.result;
                    this.showCompanies = true;
                }
            );
    }

    private getCompanyLocations(){
            this.nsfo.doGetRequest(this.nsfo.URI_CLIENTS + "/" + this.selectedCompany.company_id)
                .subscribe(
                    res => {
                        this.selectedCompany = res.result;
                        this.locations = res.result.locations;
                        this.showLocations = true;
                    }
                );
    }

    private setInvoiceRecipient() {
        this.invoice.sender_details = this.senderDetails;
        this.invoice.ubn = this.selectedLocation.ubn;
        this.invoice.company = this.selectedCompany;
        this.invoice.company_id = this.selectedCompany.company_id;
        this.invoice.company_name = this.selectedCompany.company_name;
        this.invoice.company_vat_number = this.selectedCompany.vat_number;
        this.invoice.company_debtor_number = this.selectedCompany.debtor_number;
        this.invoice.name = this.selectedCompany['owner'].first_name + this.selectedCompany['owner'].last_name;
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