import { Pipe, PipeTransform } from '@angular/core';
import { Location } from '../../main/client/client.model';

@Pipe({name: 'ubnDropDownPipe'})
export class UbnDropdownPipes implements PipeTransform {

	transform(locations: Location[], ubnInput: string): any {

		let filteredLocations = locations;

		if (ubnInput) {
			const needle = ubnInput;
			filteredLocations = filteredLocations.filter(location => {
				const haystack = location.ubn; // + add other variables to search in here
				return haystack.indexOf(needle) !== -1;
			});
		}

		return filteredLocations
	}

}