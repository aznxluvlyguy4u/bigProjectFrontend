import _ = require("lodash");
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import { LedgerCategory } from "../../../../global/models/ledger-category.model";
import {InvoiceRule} from "../../config.model";
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES, Validators} from "@angular/forms";
import {NSFOService} from "../../../../global/services/nsfo/nsfo.service";
import { LedgerCategoryDropdownComponent } from "../../../../global/components/ledgercategorydropdown/ledger-category-dropdown.component";
import { SettingsService } from '../../../../global/services/settings/settings.service';

@Component({
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, LedgerCategoryDropdownComponent],
    template: require('./standardInvoiceRules.html'),
    pipes: [TranslatePipe]
})

export class InvoicesRuleTemplatesComponent {
    private rules: InvoiceRule[] = [];
    private generalRules: InvoiceRule[] = [];
    private animalHealthRules: InvoiceRule[] = [];
    private selectedRule: InvoiceRule = new InvoiceRule();
    private selectedRuleTemp: InvoiceRule;
    selectedLedgerCategory: LedgerCategory;
    private displayModal: string = 'none';
    private isModalEditMode: boolean = false;
    private isValidForm: boolean = true;
    private isSending: boolean = false;
    private form: FormGroup;

	  isLoading: boolean = true;

    constructor(private fb: FormBuilder, private nsfo: NSFOService, private settings: SettingsService) {
        this.form = fb.group({
            description: ['', Validators.required],
            price_excl_vat: ['', Validators.required],
            vat_percentage_rate: ['', Validators.required],
        });
        this.getInvoiceRules();
    }

    private getInvoiceRules() {
        this.nsfo
            .doGetRequest(this.nsfo.URI_INVOICE_RULE + "?type=standard")
            .subscribe(
                res => {
                    this.rules = res.result;

                    for(let rule of this.rules) {
                        switch (rule.category) {
                            case InvoiceCategory.General:
                                this.generalRules.push(rule);
                                break;

                            case InvoiceCategory.AnimalHealth:
                                this.animalHealthRules.push(rule);
                                break;
                        }
                    }

                    this.isLoading = false;
                },
							error => {
									this.isLoading = false;
									alert(this.nsfo.getErrorMessage(error));
                }

            );

    }

    private setSelectedLedgerCategoryOnSelectedRule() {
        if(this.selectedRule) {
            this.selectedRule.ledger_category = this.selectedLedgerCategory;
        }
    }

    private addInvoiceRule() {
        this.isValidForm = true;
        this.isSending = true;
        this.selectedRule.type = "standard";
        this.setSelectedLedgerCategoryOnSelectedRule();

        if(this.form.valid) {
            this.selectedRule.sort_order = this.rules.length;

            this.nsfo
                .doPostRequest(this.nsfo.URI_INVOICE_RULE , this.selectedRule)
                .subscribe(
                    res => {
                        let rule = res.result;
                        switch (rule.category) {
                            case InvoiceCategory.General:
                                this.generalRules.push(rule);
                                break;

                            case InvoiceCategory.AnimalHealth:
                                this.animalHealthRules.push(rule);
                                break;
                        }
                        
                        this.isSending = false;
                        this.closeModal();
                    }
                )
        } else {
            this.isValidForm = false;
            this.isSending = false;
        }
    }

    private editInvoiceRule() {
        this.isValidForm = true;
        this.isSending = true;
			  this.setSelectedLedgerCategoryOnSelectedRule();

        if(this.form.valid) {
            this.nsfo
                .doPutRequest(this.nsfo.URI_INVOICE_RULE, this.selectedRule)
                .subscribe(
                    res => {
                        switch (this.selectedRule.category) {
                            case InvoiceCategory.General:
                                this.generalRules.push(this.selectedRule);
                                break;

                            case InvoiceCategory.AnimalHealth:
                                this.animalHealthRules.push(this.selectedRule);
                                break;
                        }
                        switch (this.selectedRuleTemp.category) {
                            case InvoiceCategory.General:
                                _.remove(this.generalRules, this.selectedRuleTemp);
                                break;

                            case InvoiceCategory.AnimalHealth:
                                _.remove(this.animalHealthRules, this.selectedRuleTemp);
                                break;
                        }
                        this.isSending = false;
                        this.closeModal();
                    }
                );
        } else {
            this.isValidForm = false;
        }
    }

    removeInvoiceRule(rule: InvoiceRule) {
        switch (rule.category) {
            case InvoiceCategory.General:
                _.remove(this.generalRules, rule);
                break;

            case InvoiceCategory.AnimalHealth:
                _.remove(this.animalHealthRules, rule);
                break;
        }
        this.nsfo.doDeleteRequest(this.nsfo.URI_INVOICE_RULE + "/" + rule.id, rule)
            .subscribe();
    }
    
    openModal(isEditMode: boolean = false, category: string, rule: InvoiceRule): void {
        this.isModalEditMode = isEditMode;
        this.displayModal = 'block';

        if(!isEditMode) {
            this.selectedRule.category = category;
            this.selectedLedgerCategory = null;
        }

        if(isEditMode) {
            this.selectedRule = _.cloneDeep(rule);
            this.selectedRuleTemp = _.cloneDeep(rule);
            this.selectedLedgerCategory = _.cloneDeep(rule.ledger_category);
        }
    }

    private closeModal(): void {
        this.displayModal = 'none';
        this.selectedRule = new InvoiceRule();
        this.resetValidation();
    }

    disableEditOrInsertButton(): boolean {
        return this.isSending
            || this.selectedRule == null
            || this.selectedLedgerCategory == null
            || this.selectedRule.description == '' || this.selectedRule.description == null
            || this.selectedRule.price_excl_vat == undefined
            || this.selectedRule.vat_percentage_rate == undefined
          ;
    }

    getVatPercentages(): number[] {
        return this.settings.getVatPercentages();
    }

    private resetValidation() {}
}

enum InvoiceCategory {
    General = "GENERAL",
    AnimalHealth = "ANIMAL HEALTH"
}