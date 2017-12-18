import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../main/client/client.model';
import { UtilsService } from '../services/utils/utils.service';

@Pipe({name: 'userSearchPipe'})

export class UserSearchPipe implements PipeTransform {
	transform(value, term) {
		if (!term) {
			return value;
		}
		return value.filter((user: User) => {
			const needle = term.toLowerCase();

			let haystack =
				user.first_name +
				user.last_name +
				user.email_address +
				user.prefix +
				user.relation_number_keeper +
				user.type +
				UtilsService.getPersonType(user)
			;

			if (user.companies) {

					for(let company of user.companies) {

							if (company.locations) {
									for(let location of company.locations) {
										haystack += location.ubn
											+ location.location_holder;
									}
							}

							haystack += company.company_name;

							if (company.address != null) {
								haystack += company.address.street_name
									+ company.address.address_number
									+ company.address.address_number_suffix
									+ company.address.postal_code
									+ company.address.city
									+ company.address.country
									+ company.address.state
								;
							}

					}

			}

			return haystack.toLowerCase().indexOf(needle) !== -1;
		});
	}
}