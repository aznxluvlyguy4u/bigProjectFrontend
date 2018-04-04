import {Component} from "@angular/core";
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { TranslatePipe } from 'ng2-translate';
import { AnimalReportsComponent } from './animals-overviews/animal-reports.component';

@Component({
	  selector: 'app-report-main',
    template: require('./report.component.html'),
		directives: [ROUTER_DIRECTIVES, AnimalReportsComponent],
	  pipes: [TranslatePipe],
})
export class ReportComponent {


	constructor(private router: Router) {}

	private navigateTo(url: string) {
		this.router.navigate([url]);
	}
}
