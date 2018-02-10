import { Injectable } from '@angular/core';

@Injectable()
export class FormatService {
	public static getFormatCheckedNumber(number) {
		if (typeof number === 'string') {
			// convert to number if string
			number = +number;
		}
		return number;
	}
}