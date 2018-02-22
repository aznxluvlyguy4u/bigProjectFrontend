import { Pipe, PipeTransform } from '@angular/core';
import { LedgerCategory } from '../models/ledger-category.model';
import { InvoiceRule } from '../../main/invoice/invoice.model';

@Pipe({name: 'ledgerCategorySearchPipe'})
export class InvoiceRulePipe implements PipeTransform {
	transform(list: InvoiceRule[], args) {

		let search_input: string = args[0];
		let activeOnly: boolean = args[1];

		if (search_input === '' && !activeOnly) {
			return list;
		}

		let filtered = list;

		filtered = list.filter((ledgerCategory: LedgerCategory) => {
			const needle = search_input.toLowerCase();

			let haystack =
				ledgerCategory.description +
				ledgerCategory.code
			;

			return haystack.toLowerCase().indexOf(needle) !== -1;
		});

		if (activeOnly) {
			filtered = list.filter(ledgerCategory => ledgerCategory.is_active === true);
		}

		return filtered
	}
}