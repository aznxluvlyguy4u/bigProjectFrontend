import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'searchPipe'})

export class SearchPipe implements PipeTransform {
	transform(value, term) {
		if (!term) {
			return value;
		}
		return value.filter((item) => {
			const needle = term.toLowerCase();
			const firstName = item['first_name'].toLowerCase();
			const lastName = item['last_name'].toLowerCase();
			const haystack = firstName + lastName;

			return haystack.indexOf(needle) !== -1;
		});
	}
}