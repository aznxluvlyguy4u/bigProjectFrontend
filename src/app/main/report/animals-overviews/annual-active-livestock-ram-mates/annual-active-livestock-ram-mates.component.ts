import { Component } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import {
	ANNUAL_ACTIVE_LIVESTOCK_RAM_MATES_REPORT
} from '../../../../global/constants/report-type.constant';
import { DownloadService } from '../../../../global/services/download/download.service';
import { YearDropdownComponent } from '../../../../global/components/yeardropdown/year-dropdown.component';

@Component({
	selector: 'app-annual-active-livestock-ram-mates',
	template: require('./annual-active-livestock-ram-mates.component.html'),
	directives: [YearDropdownComponent],
	pipes: [TranslatePipe]
})
export class AnnualActiveLivestockRamMatesComponent {
	title = ANNUAL_ACTIVE_LIVESTOCK_RAM_MATES_REPORT;

	year: number;

	constructor(private downloadService: DownloadService) {
		this.initializeValues();
	}

	initializeValues() {
		this.year = (new Date()).getUTCFullYear();
	}

	download() {
		this.downloadService.doAnnualActiveLivestockRamMatesReportGetRequest(this.year);
	}
}