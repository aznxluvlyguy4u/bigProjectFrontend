import {Pipe, PipeTransform} from "@angular/core";
import { AnnouncementLocationOutput, InspectionAnnouncement } from '../health.model';

@Pipe({
	name: 'inspectionLocationPipe'
})
export class InspectionLocationPipe implements PipeTransform {

	transform(value: any, search_input: string) {

		if (!!search_input && search_input !== '') {

			return value.filter((announcementLocationOutput: AnnouncementLocationOutput) => {
				const needle = search_input.toLowerCase();

				let haystack =
					announcementLocationOutput.ubn +
					announcementLocationOutput.first_name +
					announcementLocationOutput.last_name +
					announcementLocationOutput.illness_type
				;

				return haystack.toLowerCase().indexOf(needle) !== -1;
			});
		}

		return value;
	}
}

