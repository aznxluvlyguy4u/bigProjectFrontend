import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'invoiceFilter'
})

export class invoiceFilterPipe implements PipeTransform{
    transform(list: any, args: string[]): any {
        let statusFilter: string = args[0];

        let filtered = list;

        if (statusFilter == 'UNPAID INVOICES'){
            filtered = filtered.filter(invoice => {
                return invoice.status == 'UNPAID';
            });
        }

        if (statusFilter == 'NOT SEND INVOICES') {
            filtered = filtered.filter(invoice => {
                return invoice.status == 'NOT SEND';
            });
        }

        if (statusFilter == 'PAID INVOICES') {
            filtered = filtered.filter(invoice => {
                return invoice.status == 'PAID';
            });
        }

        if (statusFilter == "INCOMPLETE INVOICES") {
            filtered = filtered.filter(invoice => {
                return invoice.status == 'INCOMPLETE';
            });
        }

        return filtered;
    }
}