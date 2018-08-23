import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'clientFilter'
})

export class ClientFilterPipe implements PipeTransform {

    transform(list: any, args: string[]): any {
        let search_input: string = args[0];
        let invoices_option: string = args[1];
        let countryName: string = args[2];

        let filtered = list;

        // FILTER: INVOICES
        if (invoices_option == 'UNPAID INVOICES') {
            filtered = filtered.filter(client => {
                return client.unpaid_invoices > 0
            });
        }

        // FILTER: SEARCH
        if (search_input) {
            search_input = args[0].toLocaleUpperCase();
            filtered = filtered.filter(client => (
                client.debtor_number +
                client.company_name.toLocaleUpperCase() +
                client.address.city.toLocaleUpperCase() +
                client.owner.first_name.toLocaleUpperCase() +
                client.owner.last_name.toLocaleUpperCase() +
                client.locations +
                client.subscription_date +
                (client.billing_address != null ? client.billing_address.street_name : '') +
                (client.billing_address != null ? client.billing_address.address_number : '') +
                (client.billing_address != null ? client.billing_address.address_number_suffix : '') +
                (client.billing_address != null ? client.billing_address.postal_code : '') +
                (client.billing_address != null ? client.billing_address.city : '') +
                (client.billing_address != null ? client.billing_address.country : '')
            ).indexOf(search_input) !== -1);
        }

			// FILTER: COUNTRY NAME
			if (countryName !== 'ALL') {
				filtered = filtered.filter(client => (
					(client.address != null ?
              (client.address.country != null && client.address.country != undefined && client.address.country != '') ?
              client.address.country
                : '' : '' )
				).indexOf(countryName) !== -1);
			}

        return filtered
    }
}
