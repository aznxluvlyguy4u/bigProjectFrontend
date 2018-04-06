import { Component } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { ALL_ANIMALS_OVERVIEW_REPORT } from '../../../../global/constants/report-type.constant';
import { DownloadService } from '../../../../global/services/download/download.service';
import { BooleanSwitchComponent } from '../../../../global/components/booleanswitch/boolean-switch.component';

@Component({
	selector: 'app-all-animals-overview',
	template: require('./all-animals-overview.component.html'),
	directives: [BooleanSwitchComponent],
	pipes: [TranslatePipe]
})
export class AllAnimalsOverviewComponent {
	title = ALL_ANIMALS_OVERVIEW_REPORT;

	concatBreedValueAndAccuracyColumns: boolean;

	constructor(private downloadService: DownloadService) {
		this.initializeValues();
	}

	initializeValues() {
		this.concatBreedValueAndAccuracyColumns = false;
	}

	download() {
		this.downloadService.doAnimalsOverviewReportGetRequest(this.concatBreedValueAndAccuracyColumns);
	}
}