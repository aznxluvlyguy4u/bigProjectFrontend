import { Component } from '@angular/core';
import { TreatmentTemplateComponent } from './treatment-template/treatment-template.component';
import { TreatmentTypeComponent } from './treatment-type/treatment-type.component';
import { TreatmentPrescriptionComponent } from './treatment-prescription/treatment-prescription.component';
import { TreatmentMedicineComponent } from './treatment-medicines/treatment-medicine.component';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';
import { TranslatePipe } from 'ng2-translate';

@Component({
	selector: 'app-treatment-main',
	template: require('./treatment-main.component.html'),
	directives: [ROUTER_DIRECTIVES, TreatmentPrescriptionComponent, TreatmentTemplateComponent, TreatmentTypeComponent, TreatmentMedicineComponent],
	pipes: [TranslatePipe],
	providers: []
})
export class TreatmentMainComponent {

	constructor(private router: Router) {}

	private navigateTo(url: string) {
		this.router.navigate([url]);
	}

}