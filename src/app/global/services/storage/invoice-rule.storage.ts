import { InvoiceRule } from '../../../main/invoice/invoice.model';
import { NSFOService } from '../nsfo/nsfo.service';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

import _ = require('lodash');

@Injectable()
export class InvoiceRuleStorage {

	invoiceRules: InvoiceRule[] = [];

	invoiceRulesChanged = new Subject<InvoiceRule[]>();

	constructor(private nsfo: NSFOService) {}

	isInitialized(): boolean {
		return this.invoiceRules.length > 0;
	}

	initialize() {
		if (!this.isInitialized()) {
			this.refresh();
		}
	}

	refresh() {
		this.doGetActiveGeneralInvoiceRules();
	}

	private doGetActiveGeneralInvoiceRules(): void {
		this.nsfo.doGetRequest(this.nsfo.URI_INVOICE_RULE + "?category=GENERAL&type=standard&active_only=true")
			.subscribe(
				res => {
					this.invoiceRules = <InvoiceRule[]> res.result;
					this.notifyInvoiceRulesChanged();
				},
				error => {
					alert(this.nsfo.getErrorMessage(error));
				}
			)
	}

	private notifyInvoiceRulesChanged() {
		this.invoiceRulesChanged.next(this.invoiceRules);
	}

	getUpdatedInvoiceRule(invoiceRule: InvoiceRule): InvoiceRule {
		return _.find(this.invoiceRules, {id: invoiceRule.id})
	}
}