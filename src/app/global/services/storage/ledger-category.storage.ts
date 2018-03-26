import { Injectable } from '@angular/core';
import { NSFOService } from '../nsfo/nsfo.service';
import { LedgerCategory } from '../../models/ledger-category.model';
import { Client } from '../../../main/client/client.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LedgerCategoryStorage {

	ledgerCategories: LedgerCategory[] = [];

	ledgerCategoriesChanged = new Subject<LedgerCategory[]>();

	constructor(private nsfo: NSFOService) {}

	initialize() {
		if (this.ledgerCategories.length === 0) {
			this.refresh();
		}
	}

	refresh() {
		this.getLedgerCategories();
	}

	private getLedgerCategories() {
		this.nsfo
			.doGetRequest(this.nsfo.URI_LEDGER_CATEGORIES + '?active_only=false')
			.subscribe(
				res => {
					this.ledgerCategories = res.result;
					this.notifyLedgerCategoriesChanged();
				},
				error => {
					alert(this.nsfo.getErrorMessage(error));
				}
			);
	}

	getLedgerCategoriesActiveOnly() {
		return this.ledgerCategories.filter(ledgerCategory => ledgerCategory.is_active === true);
	}

	notifyLedgerCategoriesChanged() {
		this.ledgerCategoriesChanged.next(this.ledgerCategories);
	}
}