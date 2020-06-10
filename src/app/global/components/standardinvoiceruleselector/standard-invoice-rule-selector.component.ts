import { InvoiceRuleStorage } from '../../services/storage/invoice-rule.storage';
import { Client } from '../../../main/client/client.model';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InvoiceRule } from '../../../main/invoice/invoice.model';
import { TranslatePipe } from 'ng2-translate';
import { SpinnerComponent } from '../spinner/spinner.component';
import { PaginatePipe, PaginationService } from 'ng2-pagination';
import { PaginationComponent } from '../pagination/pagination.component';
import { InvoiceRulePipe } from '../../pipes/invoice-rule.pipe';
import { Router } from '@angular/router';
import {Subscription} from "rxjs/Subscription";

@Component({
	selector: 'app-standard-invoice-rule-selector',
	template: require('./standard-invoice-rule-selector.component.html'),
	directives: [SpinnerComponent, PaginationComponent],
	providers: [PaginationService],
	pipes: [TranslatePipe, InvoiceRulePipe, PaginatePipe]
})
export class StandardInvoiceRuleSelectorComponent {
	
	isLoaded: boolean;

	filterSearch: string;
	filterAmount: number;

	displayModal: string;
	initialSelectedInvoiceRule: InvoiceRule;

	@Input() selectedInvoiceRule: InvoiceRule;
	@Input() disabled: boolean = false;
	@Input() displayActiveStatus: boolean = false;
	@Output() selectedInvoiceRuleChanged = new EventEmitter<InvoiceRule>();

	isLoadedEvent = new EventEmitter<boolean>();

	private requestSub: Subscription;
	
	constructor(private invoiceRuleStorage: InvoiceRuleStorage, private router: Router) {}

	ngOnInit() {
		this.setInitialValues();
		this.initialSelectedInvoiceRule = this.selectedInvoiceRule;

		if (this.isInvoiceRulesEmpty()) {

			this.requestSub = this.invoiceRuleStorage.invoiceRulesChanged.takeLast(1)
				.subscribe(
					res => {
						this.isLoaded = true;
						this.isLoadedEvent.emit(true);
					},
					error => {
						alert('ERROR RELOADING CLIENTS');
					}
				);
		}

		this.invoiceRuleStorage.refresh();
	}

	ngOnDestroy() {
		if (this.requestSub) {
			this.requestSub.unsubscribe();
		}
	}

	isInvoiceRulesEmpty(): boolean {
		return !this.invoiceRuleStorage.isInitialized();
	}

	private setInitialValues() {
		this.displayModal = 'none';
		this.filterSearch = '';
		this.filterAmount = 10;
	}

	navigateToEditInvoiceRules() {
		this.router.navigate(['/configuration/invoices/invoices_rule_templates']);
	}

	disableEditOrInsertButton(): boolean {
		return this.isInvoiceRulesEmpty() || this.selectedInvoiceRule == null;
	}

	getInvoiceRules(): InvoiceRule[] {
		return this.invoiceRuleStorage.invoiceRules;
	}

	selectInvoiceRule(invoiceRule: InvoiceRule) {
		this.selectedInvoiceRule = invoiceRule;
		this.clickOK();
	}

	buttonText(): string {
		if (this.selectedInvoiceRule) {
			return this.selectedInvoiceRule.description;
		}
		return 'SELECT INVOICE RULE';
	}

	description(): string {
		return this.selectedInvoiceRule ? this.selectedInvoiceRule.description : '';
	}

	openModal() {
		this.displayModal = 'block';
	}

	closeModal() {
		this.displayModal = 'none';
		this.setInitialValues();
	}

	clickCancel() {
		this.closeModal();
		this.selectedInvoiceRule = this.initialSelectedInvoiceRule;
	}

	clickOK() {
		this.closeModal();
		this.initialSelectedInvoiceRule = this.selectedInvoiceRule;
		this.notifySelectedClientChanged();
	}

	notifySelectedClientChanged() {
		this.selectedInvoiceRuleChanged.emit(this.selectedInvoiceRule);
	}

	getFilterOptions() {
		return [
			this.filterSearch
		];
	}
}