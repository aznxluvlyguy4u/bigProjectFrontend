import { Component } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import {
	ANNUAL_ACTIVE_LIVESTOCK_REPORT
} from '../../../../global/constants/report-type.constant';
import { DownloadService } from '../../../../global/services/download/download.service';
import { YearDropdownComponent } from '../../../../global/components/yeardropdown/year-dropdown.component';

@Component({
	selector: 'app-annual-active-livestock',
	template: require('./annual-active-livestock.component.html'),
	directives: [YearDropdownComponent],
	pipes: [TranslatePipe]
})
export class AnnualActiveLivestockComponent {
	title = ANNUAL_ACTIVE_LIVESTOCK_REPORT;

	year: number;

	constructor(private downloadService: DownloadService) {
		this.initializeValues();
	}

	initializeValues() {
		this.year = (new Date()).getUTCFullYear();
	}

	download() {
		this.downloadService.doAnnualActiveLivestockReportGetRequest(this.year);
	}
}