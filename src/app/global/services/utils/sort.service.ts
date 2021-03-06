import { Injectable } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Country } from '../../models/country.model';

@Injectable()
export class SortService {

	constructor(private translateService: TranslateService)  {}

	sort(list: any[], options: SortOrder[], undefinedValuesOnTop: boolean = false): any[] {
		let sortedList = list;

		const reversedOptions = [...options].reverse();
		for(let sortOrder of reversedOptions) {
			sortedList = this.sortObjectWithSingleSortOrder(sortedList, sortOrder, undefinedValuesOnTop);
		}

		return sortedList;
	}

	sortTranslatedValues(list: string[], isAscending: boolean = true): string[] {
		const direction = isAscending ? 1 : -1;

		return list.sort(
			(n1, n2) => {
				if (this.translateService.instant(n1) > this.translateService.instant(n2)) {
					return direction;
				}
				if (this.translateService.instant(n1) < this.translateService.instant(n2)) {
					return -1 * direction;
				}
				return 0;
			}
		);
	}

	private sortObjectWithSingleSortOrder(list: any[], sortOrder: SortOrder, undefinedValuesOnTop: boolean = false) {
		const direction = sortOrder.ascending ? 1 : -1;
		const variableName = sortOrder.variableName;

		return list.sort(
			(n1, n2) => {

				if (n1[variableName] == null || n1[variableName] == undefined) {
					return undefinedValuesOnTop ? direction : -direction;
				}

				if (n2[variableName] == null || n2[variableName] == undefined) {
					return undefinedValuesOnTop ? -direction : direction;
				}

				if (sortOrder.isDate) {
					return (n1[variableName] - n2[variableName]) * direction;

				} else {
					if (n1[variableName] > n2[variableName]) {
						return direction;
					}
					if (n1[variableName] < n2[variableName]) {
						return -1 * direction;
					}
					return 0;
				}

			}
		);
	}

	sortCountries(list: Country[], sortVar: string, translateValues: boolean): Country[] {
		return list.sort(
			(n1, n2) => {
				return this.compareTwoCountryNamesForSort(n1[sortVar], n2[sortVar], 1, translateValues);
			}
		);
	}


	sortCountryNames(countryNamesList: string[], translateValues: boolean): string[] {
		return countryNamesList.sort(
			(countryName1, countryName2) => {
				return this.compareTwoCountryNamesForSort(countryName1, countryName2, 1, translateValues);
			}
		);
	}


	/**
	 *
	 * @param {string} countryName1
	 * @param {string} countryName2
	 * @param {number} direction 1 = sort ascending, -1 is sort descending
	 * @param {boolean} translateValues
	 * @returns {number}
	 */
	compareTwoCountryNamesForSort(countryName1: string, countryName2: string, direction: number, translateValues: boolean) {
		// always put NL on the top
		if (countryName1 === 'NL' || countryName1 === 'Netherlands') {
			return -1;
		}

		if (countryName2 === 'NL' || countryName2 === 'Netherlands') {
			return 1;
		}

		// after that always put Luxemburg on top
		if (countryName1 === 'LU' || countryName1 === 'Luxembourg') {
			return -1;
		}

		if (countryName2 === 'LU' || countryName2 === 'Luxembourg') {
			return 1;
		}

		// Sort other values as usual, based on their translated values
		if (translateValues) {

			if (this.translateService.instant(countryName1) > this.translateService.instant(countryName2)) {
				return direction;
			}

			if (this.translateService.instant(countryName1) < this.translateService.instant(countryName2)) {
				return -1 * direction;
			}

		} else {

			if (countryName1 > countryName2) {
				return direction;
			}

			if (countryName1 < countryName2) {
				return -1 * direction;
			}

		}


		return 0;
	}
}

export class SortOrder {
	variableName: string;
	ascending: boolean = true;
	isDate: boolean = false;
}