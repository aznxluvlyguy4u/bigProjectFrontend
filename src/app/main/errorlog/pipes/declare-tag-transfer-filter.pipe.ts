import {Pipe, PipeTransform} from "@angular/core";
import { TagTransferItemRequest } from '../../../global/models/tag-transfer-item-request.model';

@Pipe({
    name: 'declareTagTransferFilter'
})
export class DeclareTagTransferFilterPipe implements PipeTransform {

    transform(list: TagTransferItemRequest[], args: any[]): any {

        let searchInput: string = args[0];

        let filtered = list;

				// FILTER: SEARCH
				if (searchInput != '' && searchInput != null) {
						const needle = searchInput.toLowerCase();

						filtered = filtered.filter(tagTransfer => {

							let uln_and_uln_with_space = null;
							if (tagTransfer && tagTransfer.uln_country_code && tagTransfer.uln_number) {

								uln_and_uln_with_space += tagTransfer.uln_country_code + tagTransfer.uln_number
									+ tagTransfer.uln_country_code + ' ' + tagTransfer.uln_number;

								uln_and_uln_with_space.toLowerCase();
							}

							const haystack = uln_and_uln_with_space;

							if (typeof haystack === 'string') {
									return haystack.indexOf(needle) !== -1;
							}
							return false;
						});
				}

			return filtered
    }


}
