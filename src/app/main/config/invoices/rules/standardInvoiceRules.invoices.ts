import _ = require("lodash");
import {TranslatePipe} from "ng2-translate/ng2-translate";
import { Component, EventEmitter, OnDestroy } from '@angular/core';
import {ROUTER_DIRECTIVES} from "@angular/router";
import { LedgerCategory } from "../../../../global/models/ledger-category.model";
import { InvoiceRule } from '../../../invoice/invoice.model';
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES, Validators} from "@angular/forms";
import {NSFOService} from "../../../../global/services/nsfo/nsfo.service";
import { LedgerCategoryDropdownComponent } from "../../../../global/components/ledgercategorydropdown/ledger-category-dropdown.component";
import { SettingsService } from '../../../../global/services/settings/settings.service';
import { PaginatePipe, PaginationService, IPaginationInstance } from 'ng2-pagination';
import { PaginationComponent } from '../../../../global/components/pagination/pagination.component';
import { InvoiceRulePipe } from '../../../../global/pipes/invoice-rule.pipe';
import { InvoiceDetailsComponent } from '../../../invoice/details/invoice.details';
import { InvoiceRuleStorage } from '../../../../global/services/storage/invoice-rule.storage';
import { LocalNumberFormat } from '../../../../global/pipes/local-number-format';
import {InvoiceRuleEditComponent} from "../../../../global/components/InvoiceRuleEditComponent/InvoiceRuleEditComponent";
import {Subscription} from "rxjs/Subscription";

@Component({
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, LedgerCategoryDropdownComponent,
			PaginationComponent, InvoiceRuleEditComponent],
    template: require('./standardInvoiceRules.html'),
	  providers: [PaginationService],
    pipes: [TranslatePipe, PaginatePipe, InvoiceRulePipe, LocalNumberFormat]
})

export class InvoicesRuleTemplatesComponent implements OnDestroy {
    private rules: InvoiceRule[] = [];
    private selectedRule: InvoiceRule = new InvoiceRule();
    private selectedModalRule: InvoiceRule = new InvoiceRule();
    selectedLedgerCategory: LedgerCategory;
    private displayModal: string = 'none';
    private isModalEditMode: boolean = false;
    private isValidForm: boolean = true;
    private isSending: boolean = false;
    private form: FormGroup;

	  filterSearch = '';
	  filterAmount = 10;
	  page = 1;
	  isLoading: boolean = true;
	  isLoadedEvent = new EventEmitter<boolean>();

    private requestSub: Subscription;

    constructor(
        private fb: FormBuilder,
        private nsfo: NSFOService,
        private settings: SettingsService,
        private invoiceRuleStorage: InvoiceRuleStorage
    ) {
        this.form = fb.group({
            description: ['', Validators.required],
            price_excl_vat: ['', Validators.required],
            vat_percentage_rate: ['', Validators.required],
        });
        this.getInvoiceRules();
    }

    ngOnDestroy() {
    	this.invoiceRuleStorage.refresh();
        this.requestSub.unsubscribe();
    }

    private getInvoiceRules() {
       this.requestSub = this.nsfo
            .doGetRequest(this.nsfo.URI_INVOICE_RULE)
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

    private setModalInput(rule: InvoiceRule = null) {
        if (rule === null) {
            this.selectedModalRule = new InvoiceRule();
            this.isModalEditMode = false;
            this.selectedLedgerCategory = null;
        }
        else {
            this.selectedModalRule = rule;
            this.isModalEditMode = true;
        }
        this.displayModal = "block";
    }

    private addInvoiceRule(rule: InvoiceRule) {
        this.displayModal = "none";
        this.rules.push(rule);
    }

    private editInvoiceRule(rule: InvoiceRule) {
        this.displayModal = "none";
        this.isValidForm = true;
        this.isSending = true;
        const index = _.findIndex(this.rules, {id: rule.id});
        this.rules.splice(index, 1, rule);
        this.isSending = false;
        this.closeModal();
    }

    removeInvoiceRule(rule: InvoiceRule) {
        _.remove(this.rules, {id: rule.id});
    }

    private closeModal(): void {
        this.displayModal = 'none';
    }

    disableEditOrInsertButton(): boolean {
        return this.isSending
            || this.selectedRule == null
            || this.selectedLedgerCategory == null
            || this.selectedRule.description == '' || this.selectedRule.description == null
            || this.selectedRule.price_excl_vat == undefined
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