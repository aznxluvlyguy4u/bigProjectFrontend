import { Component } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { TE100_ANNUAL_PRODUCTION } from '../../../../global/constants/report-type.constant';

@Component({
	selector: 'app-annual-te100-production',
	template: require('./annual-te100-production.component.html'),
	pipes: [TranslatePipe]
})
export class AnnualTe100ProductionComponent {
	title = TE100_ANNUAL_PRODUCTION;

	constructor() {}
}