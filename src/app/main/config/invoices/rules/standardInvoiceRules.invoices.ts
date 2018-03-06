import _ = require("lodash");
import {TranslatePipe} from "ng2-translate/ng2-translate";
import { Component, EventEmitter } from '@angular/core';
import {ROUTER_DIRECTIVES} from "@angular/router";
import { LedgerCategory } from "../../../../global/models/ledger-category.model";
import { InvoiceRule } from '../../../invoice/invoice.model';
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES, Validators} from "@angular/forms";
import {NSFOService} from "../../../../global/services/nsfo/nsfo.service";
import { LedgerCategoryDropdownComponent } from "../../../../global/components/ledgercategorydropdown/ledger-category-dropdown.component";
import { SettingsService } from '../../../../global/services/settings/settings.service';
import { PaginatePipe, PaginationService } from 'ng2-pagination';
import { PaginationComponent } from '../../../../global/components/pagination/pagination.component';
import { InvoiceRulePipe } from '../../../../global/pipes/invoice-rule.pipe';
import { InvoiceDetailsComponent } from '../../../invoice/details/invoice.details';

@Component({
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, LedgerCategoryDropdownComponent,
			PaginationComponent],
    template: require('./standardInvoiceRules.html'),
	  providers: [PaginationService],
    pipes: [TranslatePipe, PaginatePipe, InvoiceRulePipe]
})

export class InvoicesRuleTemplatesComponent {
    private rules: InvoiceRule[] = [];
    private selectedRule: InvoiceRule = new InvoiceRule();
    selectedLedgerCategory: LedgerCategory;
    private displayModal: string = 'none';
    private isModalEditMode: boolean = false;
    private isValidForm: boolean = true;
    private isSending: boolean = false;
    private form: FormGroup;

	  filterSearch = '';
		filterAmount = 10;
	  isLoading: boolean = true;

	  isLoadedEvent = new EventEmitter<boolean>();

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
                    this.isLoading = false;
                },
							error => {
									this.isLoading = false;
									this.isLoadedEvent.emit(true);
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
                        this.rules.push(rule);
											  this.selectedRule = new InvoiceRule();

                        this.isSending = false;
                        this.closeModal();
                    },
                  error => {
										this.isSending = false;
										this.closeModal();
										alert(this.nsfo.getErrorMessage(error));
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
                        const invoice = res.result;
                        const index = _.findIndex(this.rules, {id: invoice.id});
                        this.rules.splice(index, 1, invoice);
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
        } else {
            this.isValidForm = false;
        }
    }

    removeInvoiceRule(rule: InvoiceRule) {
        this.nsfo.doDeleteRequest(this.nsfo.URI_INVOICE_RULE + "/" + rule.id, rule)
            .subscribe(
              res => {
                  _.remove(this.rules, {id: rule.id});
              },
							error => {
								alert(this.nsfo.getErrorMessage(error));
							}
            );
    }
    
    openModal(isEditMode: boolean = false, rule: InvoiceRule): void {
        this.isModalEditMode = isEditMode;
        this.displayModal = 'block';

        if(!isEditMode) {
            this.selectedLedgerCategory = null;
        }

        if(isEditMode) {
            this.selectedRule = _.cloneDeep(rule);
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
						|| !this.priceHasValidDecimalCount()
          ;
    }

    priceHasValidDecimalCount(): boolean {
    	return InvoiceDetailsComponent.priceExclVatDecimalCountIsValid(this.selectedRule.price_excl_vat);
		}

    getVatPercentages(): number[] {
        return this.settings.getVatPercentages();
    }

    private resetValidation() {}

	getFilterOptions(): any[] {
		return [
			this.filterSearch,
		];
	}
}