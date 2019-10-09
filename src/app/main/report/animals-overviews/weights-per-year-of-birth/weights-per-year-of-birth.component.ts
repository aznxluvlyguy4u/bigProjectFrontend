import { Component } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { WEIGHTS_PER_YEAR_OF_BIRTH_REPORT } from '../../../../global/constants/report-type.constant';
import { DownloadService } from '../../../../global/services/download/download.service';
import { YearDropdownComponent } from '../../../../global/components/yeardropdown/year-dropdown.component';

@Component({
	selector: 'app-weights-per-year-of-birth',
	template: require('./weights-per-year-of-birth.component.html'),
	directives: [YearDropdownComponent],
	pipes: [TranslatePipe]
})
export class WeightsPerYearOfBirthComponent {
	title = WEIGHTS_PER_YEAR_OF_BIRTH_REPORT;

	yearOfBirth: number;

	constructor(private downloadService: DownloadService) {
		this.initializeValues();
	}

	initializeValues() {
		this.yearOfBirth = (new Date()).getUTCFullYear();
	}

	download() {
		this.downloadService.doWeightsPerYearOfBirthReportGetRequest(this.yearOfBirth);
	}
}
