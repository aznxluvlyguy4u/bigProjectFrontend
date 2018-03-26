import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';

export const MAX_CURRENCY_DECIMAL_COUNT = 3;

@Injectable()
export class FormatService {

	public static getFormatCheckedNumber(number) {
		if (typeof number === 'string') {
			// convert to number if string
			number = +number;
		}
		return number;
	}


	static doesNotExceedMaxCurrencyDecimalCount(number: number): boolean {
		return UtilsService.countDecimals(number) <= MAX_CURRENCY_DECIMAL_COUNT;
	}

	static isInteger(number: number) {
		return UtilsService.countDecimals(number) === 0;
	}

	static roundCurrency(price: number): number {
		if (price == null) {
			return null;
		}

		return Math.round(price * 100) / 100;
	}
}