import { Component, EventEmitter } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { CLIENT_NOTES_OVERVIEW_REPORT } from '../../../../global/constants/report-type.constant';
import { DownloadService } from '../../../../global/services/download/download.service';
import { SettingsService } from "../../../../global/services/settings/settings.service";
import { DatepickerV2Component } from "../../../../global/components/datepickerV2/datepicker-v2.component";
import { UcFirstPipe } from "../../../../global/pipes/uc-first.pipe";

@Component({
	selector: 'client-notes-overview',
	template: require('./client-notes-overview.component.html'),
	directives: [DatepickerV2Component],
	pipes: [TranslatePipe, UcFirstPipe]
})
export class ClientNotesOverviewComponent {
	title = CLIENT_NOTES_OVERVIEW_REPORT;
	startDateString: string;
	endDateString: string;

	initialValuesChanged = new EventEmitter<boolean>();

	constructor(private downloadService: DownloadService, public settings: SettingsService) {
	}

	ngOnInit() {
		this.startDateString = SettingsService.getDateString_YYYY_MM_DD_fromDate();
		this.endDateString = SettingsService.getDateString_YYYY_MM_DD_fromDate();
	}

	updateStartDateString($event) {
		this.startDateString = SettingsService.getDateString_YYYY_MM_DD_fromDate(new Date($event));
	}

	updateEndDateString($event) {
		this.endDateString = SettingsService.getDateString_YYYY_MM_DD_fromDate(new Date($event));
	}

	notifyInputValues() {
		this.initialValuesChanged.emit(true);
	}

	downloadClientNotesOverview() {
		this.downloadService.doClientNotesOverviewReportRequest(this.startDateString, this.endDateString, null);
	}
}
