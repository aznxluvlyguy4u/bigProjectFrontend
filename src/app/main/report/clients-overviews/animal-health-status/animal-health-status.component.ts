import { Component } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { ANIMAL_HEALTH_STATUS_REPORT } from '../../../../global/constants/report-type.constant';
import { DownloadService } from '../../../../global/services/download/download.service';
import { YearDropdownComponent } from '../../../../global/components/yeardropdown/year-dropdown.component';

@Component({
	selector: 'app-animal-health-status',
	template: require('./animal-health-status.component.html'),
	directives: [YearDropdownComponent],
	pipes: [TranslatePipe]
})
export class AnimalHealthStatusComponent {
	title = ANIMAL_HEALTH_STATUS_REPORT;

	constructor(private downloadService: DownloadService) {
	}

	download() {
		this.downloadService.doAnimalHealthStatusReportGetRequest();
	}
}