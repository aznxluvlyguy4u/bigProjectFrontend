import { Injectable } from '@angular/core';

@Injectable()
export class SortService {

	sort(list: any[], options: SortOrder[]): any[] {
		let sortedList = list;
		for(let sortOrder of options.reverse()) {
			sortedList = this.sortObjectWithSingleSortOrder(sortedList, sortOrder);
		}

		return sortedList;
	}

	private sortObjectWithSingleSortOrder(list: any[], sortOrder: SortOrder) {
		const direction = sortOrder.ascending ? 1 : -1;
		const variableName = sortOrder.variableName;

		return list.sort(
			(n1, n2) => {
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
}

export class SortOrder {
	variableName: string;
	ascending: boolean = true;
	isDate: boolean = false;
}