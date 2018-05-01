import { Pipe, PipeTransform } from '@angular/core';
import { LedgerCategory } from '../models/ledger-category.model';
import { InvoiceRule } from '../../main/invoice/invoice.model';

@Pipe({name: 'invoiceRuleSearchPipe'})
export class InvoiceRulePipe implements PipeTransform {
	transform(list: InvoiceRule[], args) {

		let search_input: string = args[0];

		if (search_input === '') {
			return list;
		}

		let filtered = list;

		filtered = list.filter((invoiceRule: InvoiceRule) => {
			const needle = search_input.toLowerCase();

			let haystack =
				invoiceRule.description +
				invoiceRule.price_excl_vat +
				invoiceRule.vat_percentage_rate
			;

			if (invoiceRule.ledger_category) {
				haystack += invoiceRule.ledger_category.description
				+ invoiceRule.ledger_category.code
				+ '[' +invoiceRule.ledger_category.code+']'
				;
			}

			return haystack.toLowerCase().indexOf(needle) !== -1;
		});

		return filtered
	}
}