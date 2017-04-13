import _ = require("lodash");
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {InvoiceRuleTemplate} from "../../config.model";
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES, Validators} from "@angular/forms";
import {NSFOService} from "../../../../global/services/nsfo/nsfo.service";

@Component({
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
    template: require('./invoicesRuleTemplates.invoices.html'),
    pipes: [TranslatePipe]
})

export class InvoicesRuleTemplatesComponent {
    private rules: InvoiceRuleTemplate[] = [];
    private generalRules: InvoiceRuleTemplate[] = [];
    private animalHealthRules: InvoiceRuleTemplate[] = [];
    private selectedRule: InvoiceRuleTemplate = new InvoiceRuleTemplate();
    private selectedRuleTemp: InvoiceRuleTemplate;
    private displayModal: string = 'none';
    private isModalEditMode: boolean = false;
    private isValidForm: boolean = true;
    private isSending: boolean = false;
    private isLoading: boolean = true;
    private form: FormGroup;

    constructor(private fb: FormBuilder, private nsfo: NSFOService) {
        this.form = fb.group({
            description: ['', Validators.required],
            price_excl_vat: ['', Validators.required],
            vat_percentage_rate: ['', Validators.required],
        });


        this.getInvoiceRules();
    }

    private getInvoiceRules() {
        this.nsfo
            .doGetRequest(this.nsfo.URI_INVOICE_RULE_TEMPLATE)
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
                err => {
                    this.isLoading = false;
                }

            );

    }

    private addInvoiceRule() {
        this.isValidForm = true;
        this.isSending = true;
        this.selectedRule.type = "standard";
        if(this.form.valid) {
            this.selectedRule.sort_order = this.rules.length;

            this.nsfo
                .doPostRequest(this.nsfo.URI_INVOICE_RULE_TEMPLATE , this.selectedRule)
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

        if(this.form.valid) {
            this.nsfo
                .doPutRequest(this.nsfo.URI_INVOICE_RULE_TEMPLATE, this.selectedRule)
                .subscribe(
                    res => {
                        switch (this.selectedRule.category) {
                            case InvoiceCategory.General:
                                this.removeInvoiceRule(this.selectedRuleTemp);
                                this.generalRules.push(this.selectedRule);
                                break;

                            case InvoiceCategory.AnimalHealth:
                                this.removeInvoiceRule(this.selectedRuleTemp);
                                this.animalHealthRules.push(this.selectedRule);
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

    private removeInvoiceRule(rule: InvoiceRuleTemplate) {
        console.log('test');
        this.nsfo
            .doDeleteRequest(this.nsfo.URI_INVOICE_RULE_TEMPLATE + '/' + rule.id.toString(), "")
            .subscribe(
                res => {
                    console.log('test');
                }
            );

        switch (rule.category) {
            case InvoiceCategory.General:
                _.remove(this.generalRules, rule);
                break;

            case InvoiceCategory.AnimalHealth:
                _.remove(this.animalHealthRules, rule);
                break;
        }
    }
    
    private openModal(isEditMode: boolean = false, category: string, rule: InvoiceRuleTemplate): void {
        this.isModalEditMode = isEditMode;
        this.displayModal = 'block';

        if(!isEditMode) {
            switch (category) {
                case InvoiceCategory.General:
                    this.selectedRule.category = category;
                    break;

                case InvoiceCategory.AnimalHealth:
                    this.selectedRule.category = category;
                    break;
            }
        }

        if(isEditMode) {
            this.selectedRule = _.cloneDeep(rule);
            this.selectedRuleTemp = _.cloneDeep(rule);
        }
    }

    private closeModal(): void {
        this.displayModal = 'none';
        this.selectedRule = new InvoiceRuleTemplate();
        this.resetValidation();
    }

    private resetValidation() {}
}

enum InvoiceCategory {
    General = 'GENERAL',
    AnimalHealth = 'ANIMAL HEALTH'
}