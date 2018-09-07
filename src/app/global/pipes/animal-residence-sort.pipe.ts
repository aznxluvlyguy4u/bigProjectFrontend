import { Pipe, PipeTransform } from '@angular/core';
import { SortOrder, SortService } from '../services/utils/sort.service';
import { AnimalResidenceHistory } from '../models/animal-residence-history.model';

@Pipe({
	name: 'animalResidenceSortPipe'
})
export class AnimalResidenceSortPipe implements PipeTransform {

	constructor(private sort: SortService) {}

	transform(list: AnimalResidenceHistory[], sortAscending: boolean = false): AnimalResidenceHistory[] {

		const sortOrderStartDate: SortOrder = {
			variableName: 'start_date',
			ascending: sortAscending,
			isDate: false // it is date string, not a date
		};

		const sortOrderEndDate: SortOrder = {
			variableName: 'end_date',
			ascending: sortAscending,
			isDate: false // it is date string, not a date
		};

		return this.sort.sort(list, [sortOrderStartDate, sortOrderEndDate], true);
	}
}