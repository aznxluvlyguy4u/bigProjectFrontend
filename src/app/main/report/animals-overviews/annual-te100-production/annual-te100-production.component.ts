import { Component } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { TE100_ANNUAL_PRODUCTION } from '../../../../global/constants/report-type.constant';
import { DownloadService } from '../../../../global/services/download/download.service';
import { YearDropdownComponent } from '../../../../global/components/yeardropdown/year-dropdown.component';

@Component({
	selector: 'app-annual-te100-production',
	template: require('./annual-te100-production.component.html'),
	directives: [YearDropdownComponent],
	pipes: [TranslatePipe]
})
export class AnnualTe100ProductionComponent {
	title = TE100_ANNUAL_PRODUCTION;

	year: number;

	constructor(private downloadService: DownloadService) {
		this.initializeValues();
	}

	initializeValues() {
		this.year = (new Date()).getUTCFullYear();
	}

	download() {
		this.downloadService.doAnnualTe100UbnProductionReportGetRequest(this.year);
	}
}