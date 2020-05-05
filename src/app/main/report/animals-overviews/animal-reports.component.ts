import { Component } from '@angular/core';
import { TranslatePipe, TranslateService } from 'ng2-translate';
import {
	ALL_ANIMALS_OVERVIEW_REPORT,
	ANNUAL_ACTIVE_LIVESTOCK_RAM_MATES_REPORT,
	ANNUAL_ACTIVE_LIVESTOCK_REPORT,
	TE100_ANNUAL_PRODUCTION,
	WEIGHTS_PER_YEAR_OF_BIRTH_REPORT,
	POPREP_INPUT_FILE,
	ANIMAL_FEATURES_PER_YEAR_OF_BIRTH_REPORT,
	ANIMAL_TREATMENTS_PER_YEAR_OF_BIRTH_REPORT
} from '../../../global/constants/report-type.constant';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { AllAnimalsOverviewComponent } from './all-animals-overview/all-animals-overview.component';
import { AnnualTe100ProductionComponent } from './annual-te100-production/annual-te100-production.component';

@Component({
	selector: 'app-animals-overview',
	template: require('./animal-reports.component.html'),
	directives: [ROUTER_DIRECTIVES, AllAnimalsOverviewComponent, AnnualTe100ProductionComponent],
	pipes: [TranslatePipe]
})
export class AnimalReportsComponent {

	selectedOption: string;

	private reportBaseUrl = '/report/animal-reports/';

	constructor(private router: Router) {
		this.selectedOption = ALL_ANIMALS_OVERVIEW_REPORT;
	}

	getAnimalReportOptions(): string[] {
		return [
			ALL_ANIMALS_OVERVIEW_REPORT,
			TE100_ANNUAL_PRODUCTION,
			ANNUAL_ACTIVE_LIVESTOCK_REPORT,
			ANNUAL_ACTIVE_LIVESTOCK_RAM_MATES_REPORT,
			WEIGHTS_PER_YEAR_OF_BIRTH_REPORT,
			ANIMAL_FEATURES_PER_YEAR_OF_BIRTH_REPORT,
			ANIMAL_TREATMENTS_PER_YEAR_OF_BIRTH_REPORT,
			POPREP_INPUT_FILE
		];
	}

	loadAnimalReportComponent() {
		let url = this.reportBaseUrl;
		switch (this.selectedOption) {
			case ALL_ANIMALS_OVERVIEW_REPORT: url += 'all-animals-overview'; break;
			case TE100_ANNUAL_PRODUCTION: url += 'annual-te100-production'; break;
			case ANNUAL_ACTIVE_LIVESTOCK_REPORT: url += 'annual-active-livestock'; break;
			case ANNUAL_ACTIVE_LIVESTOCK_RAM_MATES_REPORT: url += 'annual-active-livestock-ram-mates'; break;
			case ANIMAL_FEATURES_PER_YEAR_OF_BIRTH_REPORT: url += 'animal-features-per-year-of-birth'; break;
			case WEIGHTS_PER_YEAR_OF_BIRTH_REPORT: url += 'weights-per-year-of-birth'; break;
			case POPREP_INPUT_FILE: url += 'poprep-input-file'; break;
			case ANIMAL_TREATMENTS_PER_YEAR_OF_BIRTH_REPORT: url += 'animal-treatments-per-year-of-birth'; break;
			default: return;
		}
		this.navigateTo(url);
	}

	private navigateTo(url: string) {
		this.router.navigate([url]);
	}
}
