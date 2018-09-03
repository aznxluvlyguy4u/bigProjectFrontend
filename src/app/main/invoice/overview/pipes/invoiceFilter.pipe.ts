import {Pipe, PipeTransform} from "@angular/core";
@Pipe({
    name: "invoiceFilter"
})

export class invoiceFilterPipe implements PipeTransform{
    transform(list: any, args: any[]): any {
        let filterInput: string = args[0];
        let statusFilter: string = args[1];
        let isBatch: string = args[2];
        let filterTotalExclVatMin: number = args[3];
        let filterTotalExclVatMax: number = args[4];
        let filtered = list;

        if (statusFilter) {
            if (statusFilter == "UNPAID INVOICES"){
                filtered = filtered.filter(invoice => {
                    return invoice.status == "UNPAID";
                });
            }

            if (statusFilter == "NOT SEND INVOICES") {
                filtered = filtered.filter(invoice => {
                    return invoice.status == "NOT SEND";
                });
            }

            if (statusFilter == "PAID INVOICES") {
                filtered = filtered.filter(invoice => {
                    return invoice.status == "PAID";
                });
            }

            if (statusFilter == "INCOMPLETE INVOICES") {
                filtered = filtered.filter(invoice => {
                    return invoice.status == "INCOMPLETE";
                });
            }

            if (statusFilter == "CANCELLED INVOICES") {
                filtered = filtered.filter(invoice => {
                    return invoice.status == "CANCELLED";
                });
            }

            if (statusFilter == "ALL") {
                filtered = filtered.filter(invoice => {
                    return invoice !== null;
                });
            }
        }

        if (filterInput) {
            filterInput = args[0].toLocaleUpperCase();
            filtered = filtered.filter(invoice => (
                invoice.invoice_number +
                (invoice.invoice_date != null ? invoice.invoice_date : "") +
                (invoice.paid_date != null ? invoice.paid_date : "") +
                (invoice.company_name != null ? invoice.company_name.toLocaleUpperCase() : "") +
                (invoice.company_vat_number != null ? invoice.company_vat_number : "") +
                (invoice.company_debtor_number != null ? invoice.company_debtor_number : "") +
                invoice.ubn +
                invoice.status
            ).indexOf(filterInput) !== -1);
        }

        if (filterTotalExclVatMin != undefined) {
            filtered = filtered.filter(invoice => (
              (invoice.vat_breakdown ? invoice.vat_breakdown.total_excl_vat ? invoice.vat_breakdown.total_excl_vat : 0 : 0) >= filterTotalExclVatMin)
            );
        }

			if (filterTotalExclVatMax != undefined) {
				filtered = filtered.filter(invoice => (
					(invoice.vat_breakdown ? invoice.vat_breakdown.total_excl_vat ? invoice.vat_breakdown.total_excl_vat : 0 : 0) <= filterTotalExclVatMax)
				);
			}

        if (isBatch) {
            if (isBatch === "only-manual") {
                filtered = filtered.filter(invoice => {
                    return invoice.is_batch === false;
                });
            } else if (isBatch === "only-automatic") {
							filtered = filtered.filter(invoice => {
								return invoice.is_batch === true;
							});
            }
        }
        return filtered;
    }
}
