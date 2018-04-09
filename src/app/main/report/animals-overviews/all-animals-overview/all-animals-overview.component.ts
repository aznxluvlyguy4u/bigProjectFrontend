import { Component, EventEmitter, OnInit } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { ALL_ANIMALS_OVERVIEW_REPORT } from '../../../../global/constants/report-type.constant';
import { DownloadService } from '../../../../global/services/download/download.service';
import { BooleanSwitchComponent } from '../../../../global/components/booleanswitch/boolean-switch.component';
import { DatepickerV2Component } from '../../../../global/components/datepickerV2/datepicker-v2.component';
import { SettingsService } from '../../../../global/services/settings/settings.service';

@Component({
	selector: 'app-all-animals-overview',
	template: require('./all-animals-overview.component.html'),
	directives: [BooleanSwitchComponent, DatepickerV2Component],
	pipes: [TranslatePipe]
})
export class AllAnimalsOverviewComponent implements OnInit {
	title = ALL_ANIMALS_OVERVIEW_REPORT;

	concatBreedValueAndAccuracyColumns: boolean;
	referenceDateString: string;

	initialValuesChanged = new EventEmitter<boolean>();

	constructor(private downloadService: DownloadService, private settings: SettingsService) {}

	ngOnInit() {
		this.concatBreedValueAndAccuracyColumns = false;
		this.referenceDateString = SettingsService.getDateString_YYYY_MM_DD_fromDate();
	}

	updateReferenceDateString($event) {
		this.referenceDateString = SettingsService.getDateString_YYYY_MM_DD_fromDate(new Date($event));
	}

	notifyInputValues() {
		this.initialValuesChanged.emit(true);
	}

	download() {
		this.notifyInputValues();
		this.downloadService.doAnimalsOverviewReportGetRequest(this.referenceDateString, this.concatBreedValueAndAccuracyColumns);
	}
}