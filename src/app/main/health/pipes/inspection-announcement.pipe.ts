import {Pipe, PipeTransform} from "@angular/core";
import { InspectionAnnouncement } from '../health.model';

@Pipe({
	name: 'inspectionAnnouncementPipe'
})
export class InspectionAnnouncementPipe implements PipeTransform {

	transform(value: any, term: string) {
		if (!term || term == '') {
			return value;
		}

		return value.filter((inspectionAnnouncement: InspectionAnnouncement) => {
			const needle = term.toLowerCase();

			let haystack =
					inspectionAnnouncement.location.ubn +
					inspectionAnnouncement.location.first_name +
					inspectionAnnouncement.location.last_name +
					inspectionAnnouncement.status +
					(inspectionAnnouncement.action_taken_by ? inspectionAnnouncement.action_taken_by.first_name : '') +
					(inspectionAnnouncement.action_taken_by ? inspectionAnnouncement.action_taken_by.last_name : '')
			;

			return haystack.toLowerCase().indexOf(needle) !== -1;
		});
	}
}

