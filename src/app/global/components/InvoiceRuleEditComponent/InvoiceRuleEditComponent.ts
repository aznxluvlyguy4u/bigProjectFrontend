import {Component, EventEmitter, Input, Output} from "@angular/core";
import {LedgerCategoryDropdownComponent} from "../ledgercategorydropdown/ledger-category-dropdown.component";
import {TranslatePipe} from "ng2-translate";
import {InvoiceRulePipe} from "../../pipes/invoice-rule.pipe";
import {LocalNumberFormat} from "../../pipes/local-number-format";
import {InvoiceRule} from "../../../main/invoice/invoice.model";
import {LedgerCategory} from "../../models/ledger-category.model";
import {NSFOService} from "../../services/nsfo/nsfo.service";
import {SettingsService} from "../../services/settings/settings.service";
import {InvoiceDetailsComponent} from "../../../main/invoice/details/invoice.details";
import {FormBuilder, FormGroup, REACTIVE_FORM_DIRECTIVES, Validators} from "@angular/forms";
import {ROUTER_DIRECTIVES} from "@angular/router";
@Component({
    selector: 'invoice-rule-edit-component',
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, LedgerCategoryDropdownComponent],
    template: require('./InvoiceRuleEditComponent.html'),
    pipes: [TranslatePipe, InvoiceRulePipe, LocalNumberFormat]
})

export class InvoiceRuleEditComponent {

    constructor(private fb: FormBuilder, private nsfo: NSFOService, private settings: SettingsService) {
        this.form = fb.group({
            description: ['', Validators.required],
            price_excl_vat: ['', Validators.required],
            vat_percentage_rate: ['', Validators.required],
        });
    }

    @Input() selectedRule: InvoiceRule;
    @Input() selectedLedgerCategory: LedgerCategory;
    @Input() isModalEditMode: boolean;
    @Input() displayModal: string = "none";
    @Output() sendRule = new EventEmitter<InvoiceRule>();
    @Output() newRule = new EventEmitter<InvoiceRule>();
    @Output() close = new EventEmitter<boolean>();

    private isValidForm: boolean = true;
    private isSending: boolean = false;
    private form: FormGroup;

    getVatPercentages(): number[] {
        return this.settings.getVatPercentages();
    }

    private addInvoiceRule() {
        this.isSending = true;
        this.selectedRule.type = "standard";
        this.setSelectedLedgerCategoryOnSelectedRule();
        this.selectedRule.sort_order = 1;
        this.nsfo
            .doPostRequest(this.nsfo.URI_INVOICE_RULE , this.selectedRule)
            .subscribe(
                res => {
                    let rule = res.result;
                    this.emitNewInvoiceRule(rule);
                    this.selectedRule = new InvoiceRule();

                    this.isSending = false;
                },
                error => {
                    this.isSending = false;
                    alert(this.nsfo.getErrorMessage(error));
                }
            )
    }

    private editInvoiceRule() {
        this.isSending = true;
        this.setSelectedLedgerCategoryOnSelectedRule();


        this.nsfo
            .doPutRequest(this.nsfo.URI_INVOICE_RULE, this.selectedRule)
            .subscribe(
                res => {
                    let invoiceRule = res.result;
                    this.emitInvoiceRule(invoiceRule);
                    this.isSending = false;
                },
                error => {
                    this.isSending = false;
                    this.closeModal();
                    alert(this.nsfo.getErrorMessage(error));
                }
            );
    }

    closeModal() {
    this.close.emit(true);
    }

    emitInvoiceRule(rule: InvoiceRule) {
        this.sendRule.emit(rule);
    }

    emitNewInvoiceRule(rule: InvoiceRule) {
        this.newRule.emit(rule);
    }

    private setSelectedLedgerCategoryOnSelectedRule() {
        if(this.selectedRule) {
            this.selectedRule.ledger_category = this.selectedLedgerCategory;
        }
    }

    disableEditOrInsertButton(): boolean {
        return this.isSending
            || this.selectedRule == null
            || this.selectedLedgerCategory == null
            || this.selectedRule.description == '' || this.selectedRule.description == null
            || this.selectedRule.price_excl_vat == undefined
            || this.selectedRule.vat_percentage_rate == undefined
            || !this.priceHasValidDecimalCount()
            ;
    }

    priceHasValidDecimalCount(): boolean {
        return InvoiceDetailsComponent.priceExclVatDecimalCountIsValid(this.selectedRule.price_excl_vat);
    }
}