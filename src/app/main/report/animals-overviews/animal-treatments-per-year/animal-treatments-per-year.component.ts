import { Component } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { ANIMAL_TREATMENTS_PER_YEAR_REPORT } from '../../../../global/constants/report-type.constant';
import { DownloadService } from '../../../../global/services/download/download.service';
import { YearDropdownComponent } from '../../../../global/components/yeardropdown/year-dropdown.component';

@Component({
	selector: 'app-animal-treatments-per-year-of-birth',
	template: require('./animal-treatments-per-year.component.html'),
	directives: [YearDropdownComponent],
	pipes: [TranslatePipe]
})
export class AnimalTreatmentsPerYearComponent {
	title = ANIMAL_TREATMENTS_PER_YEAR_REPORT;

	year: number;

	constructor(private downloadService: DownloadService) {
		this.initializeValues();
	}

	initializeValues() {
		this.year = (new Date()).getUTCFullYear();
	}

	download() {
		this.downloadService.doAnimalTreatmentsPerYearReportGetRequest(this.year);
	}
}
