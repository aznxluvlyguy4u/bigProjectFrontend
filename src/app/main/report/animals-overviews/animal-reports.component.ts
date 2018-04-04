import { Component } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';

@Component({
	selector: 'app-animals-overview',
	template: require('./animal-reports.component.html'),
	pipes: [TranslatePipe]
})
export class AnimalReportsComponent {
	constructor() {}
}