import { Component } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { ANIMAL_FEATURES_PER_YEAR_OF_BIRTH_REPORT } from '../../../../global/constants/report-type.constant';
import { DownloadService } from '../../../../global/services/download/download.service';
import { YearDropdownComponent } from '../../../../global/components/yeardropdown/year-dropdown.component';

@Component({
	selector: 'app-animal-features-per-year-of-birth',
	template: require('./animal-features-per-year-of-birth.component.html'),
	directives: [YearDropdownComponent],
	pipes: [TranslatePipe]
})
export class AnimalFeaturesPerYearOfBirthComponent {
	title = ANIMAL_FEATURES_PER_YEAR_OF_BIRTH_REPORT;

	year: number;

	constructor(private downloadService: DownloadService) {
		this.initializeValues();
	}

	initializeValues() {
		this.year = (new Date()).getUTCFullYear();
	}

	download() {
		this.downloadService.doAnimalFeaturesPerYearOfBirthReportGetRequest(this.year);
	}
}
