import { Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from '../services/utils/utils.service';

@Pipe({name: 'countryNameToCountryCodePipe'})
export class CountryNameToCountryCodePipe implements PipeTransform {

	transform(countryName: string, nullFiller: string = ''): string {
		if (countryName == null) {
			return nullFiller;
		}
		return UtilsService.getCountryCodeFromCountryName(countryName);
	}

}