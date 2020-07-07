import {Pipe, PipeTransform} from "@angular/core";
import { SortOrder, SortService } from '../../../../global/services/utils/sort.service';
@Pipe({
    name: "invoiceSort"
})

export class invoiceSortPipe implements PipeTransform{

    constructor(private sort: SortService) {}

    transform(list: any, sortAscending: boolean = false): any {

        const sortOrder: SortOrder = {
          variableName: 'invoice_date',
          ascending: sortAscending,
          isDate: false // it is date string, not a date
        };

        return this.sort.sort(list, [sortOrder], true);
    }
}
