import { Component } from '@angular/core';
import { TranslatePipe, TranslateService } from 'ng2-translate';
import { ALL_ANIMALS_OVERVIEW_REPORT, TE100_ANNUAL_PRODUCTION } from '../../../global/constants/report-type.constant';
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
		];
	}

	loadAnimalReportComponent() {
		let url = this.reportBaseUrl;
		switch (this.selectedOption) {
			case ALL_ANIMALS_OVERVIEW_REPORT:
				url = this.reportBaseUrl+'all-animals-overview';
				break;
			case TE100_ANNUAL_PRODUCTION:
				url = this.reportBaseUrl+'annual-te100-production';
				break;
			default:
				return;
		}
		this.navigateTo(url);
	}

	private navigateTo(url: string) {
		this.router.navigate([url]);
	}
}