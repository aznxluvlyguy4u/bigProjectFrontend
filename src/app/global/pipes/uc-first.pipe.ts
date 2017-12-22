import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'ucFirstPipe'})
export class UcFirstPipe implements PipeTransform {
	transform(value, term) {
		return value.charAt(0).toUpperCase() + value.slice(1);
	}
}