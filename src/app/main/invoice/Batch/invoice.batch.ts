import _ = require("lodash");
import {Component} from "@angular/core";
import moment = require('moment');
import {Subscription} from "rxjs/Rx";
import {Router, ActivatedRoute, ROUTER_DIRECTIVES} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES, Validators} from "@angular/forms";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {
    Invoice, InvoiceSenderDetails, InvoiceRule, InvoiceRuleSelection
} from '../invoice.model';
import { CompanySelectorComponent } from '../../../global/components/clientselector/company-selector.component';
import { LedgerCategoryDropdownComponent } from '../../../global/components/ledgercategorydropdown/ledger-category-dropdown.component';
import { StandardInvoiceRuleSelectorComponent } from '../../../global/components/standardinvoiceruleselector/standard-invoice-rule-selector.component';
import { LocalNumberFormat } from '../../../global/pipes/local-number-format';
import {Datepicker} from "../../../global/components/datepicker/datepicker.component";
import {SettingsService} from "../../../global/services/settings/settings.service";
import {LedgerCategory} from "../../../global/models/ledger-category.model";
import {FormatService} from "../../../global/services/utils/format.service";


@Component({
    selector: 'ng-select',
    properties: [
        'allowClear',
        'placeholder',
        'items',
        'multiple',
        'showSearchInputInDropdown'
    ],
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, CompanySelectorComponent,
        LedgerCategoryDropdownComponent, Datepicker, StandardInvoiceRuleSelectorComponent],
    template: require('./invoice.batch.html'),
    pipes: [TranslatePipe, LocalNumberFormat]
})

export class InvoiceBatchComponent {
    private form: FormGroup;
    private ruleForm: FormGroup;
    private selectedRule: InvoiceRule = new InvoiceRule();
    private displayModal: string = 'none';
    selectedLedgerCategory: LedgerCategory;
    private model_datetime_format;
    private view_date_format;
    private invoiceRuleList: InvoiceRule[];
    private isValidForm: boolean = true;
    private isSending: boolean = false;

    constructor(private fb: FormBuilder,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private nsfo: NSFOService,
                private settings: SettingsService,
    ) {
        this.form = fb.group({
            controlDate: ['', Validators.required]
        });
        this.ruleForm = fb.group({
            description: ['', Validators.required],
            price_excl_vat: ['', Validators.required],
            vat_percentage_rate: ['', Validators.required],
        });
        this.model_datetime_format = settings.getModelDateTimeFormat();
        this.view_date_format = settings.getViewDateFormat();
    }

    ngOnInit() {
        this.nsfo.doGetRequest(this.nsfo.URI_INVOICE_RULE + "?isBatch=true")
            .subscribe(
                res => {
                    this.invoiceRuleList = res.result;
                },
                error => {
                    alert(this.nsfo.getErrorMessage(error));
                }
            );

    }

    openModal(rule: InvoiceRule): void {
        this.displayModal = 'block';
        this.selectedRule = _.cloneDeep(rule);
        this.selectedLedgerCategory = _.cloneDeep(rule.ledger_category);
    }

    private closeModal(): void {
        this.displayModal = 'none';
        this.selectedRule = new InvoiceRule();
    }

    private setSelectedLedgerCategoryOnSelectedRule() {
        if(this.selectedRule) {
            this.selectedRule.ledger_category = this.selectedLedgerCategory;
        }
    }

    private editInvoiceRule() {
        this.isValidForm = true;
        this.isSending = true;
        this.setSelectedLedgerCategoryOnSelectedRule();


        this.nsfo
            .doPutRequest(this.nsfo.URI_INVOICE_RULE, this.selectedRule)
            .subscribe(
                res => {
                    const invoice = res.result;
                    const index = _.findIndex(this.invoiceRuleList, {id: invoice.id});
                    this.invoiceRuleList.splice(index, 1, invoice);
                    this.selectedRule = new InvoiceRule();
                    this.isSending = false;
                    this.closeModal();
                },
                error => {
                    this.isSending = false;
                    this.closeModal();
                    alert(this.nsfo.getErrorMessage(error));
                }
            );
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
        return InvoiceBatchComponent.priceExclVatDecimalCountIsValid(this.selectedRule.price_excl_vat);
    }

    static priceExclVatDecimalCountIsValid(priceExclVat: number) {
        return FormatService.doesNotExceedMaxCurrencyDecimalCount(priceExclVat);
    }

    getVatPercentages(): number[] {
        return this.settings.getVatPercentages();
    }

    sendInvoiceBatch() {
        let dateString;
        let dateFormat;
        dateString = moment(this.form.controls["controlDate"].value, this.settings.getViewDateFormat());
        dateFormat = dateString.format(this.settings.getModelDateTimeFormat());
        this.nsfo.doPostRequest(this.nsfo.URI_INVOICE + "/batch",{"controlDate": dateFormat})
            .subscribe(
                res => {

                },
                error => {
                    alert(this.nsfo.getErrorMessage(error));
                }
            )
    }
}