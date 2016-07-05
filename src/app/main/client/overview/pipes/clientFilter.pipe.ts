import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'clientFilter'
})

export class ClientFilterPipe implements PipeTransform {

    transform(list: any, args: string[]): any {
        let search_input: string = args[0];
        let invoices_option: string = args[1];

        console.log(args);

        let filtered = list;

        // FILTER: INVOICES
        if (invoices_option == 'UNPAID INVOICES') {
            filtered = filtered.filter(client => {
                return client.unpaid_invoices > 0
            });
        }

        // FILTER: SEARCH
        if (search_input != null) {
            search_input = args[0].toLocaleUpperCase();
            filtered = filtered.filter(client => (
                client.ubn +
                client.debtor_number +
                client.last_name.toLocaleUpperCase() +
                client.place.toLocaleUpperCase() +
                client.subscription_date  +
                client.animal_health.toLocaleUpperCase()  +
                client.pedigree_list +
                client.status.toLocaleUpperCase()
            ).indexOf(search_input) !== -1);
        }
        return filtered
    }
}
