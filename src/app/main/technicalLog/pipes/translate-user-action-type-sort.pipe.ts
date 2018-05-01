import {Pipe, PipeTransform} from "@angular/core";
import _ = require("lodash");
import { SortService } from '../../../global/services/utils/sort.service';

@Pipe({
	name: 'translatedUserActionTypeSortPipe'
})

export class TranslateUserActionTypeSortPipe implements PipeTransform {

	constructor(private sortService: SortService) {}

	transform(actionTypes: string[], args: any[]): string[] {
		return this.sortService.sortTranslatedValues(actionTypes);
	}
}