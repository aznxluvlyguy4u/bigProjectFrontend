import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'ucFirstPipe'})
export class UcFirstPipe implements PipeTransform {
	transform(value, term) {
		if (value.length === 0) {
			return value;
		}
		return value.charAt(0).toUpperCase() + value.slice(1);
	}
}