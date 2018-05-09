import { Component, Input } from '@angular/core';
import { HealthService } from '../health.service';
import { TranslatePipe } from 'ng2-translate';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

@Component({
	selector: 'app-illness-base',
	template: require('./illness-base.component.html'),
	providers: [ HealthService ],
	directives: [ROUTER_DIRECTIVES],
	pipes: [TranslatePipe]
})
export class IllnessBaseComponent {
	illnessTypeSubPath: string;

	private selectedRoute: string;

	constructor(private healthService: HealthService, private router: Router) {}

	navigateTo(url: string) {
		this.router.navigate([url]);
	}

	@Input()
	set illnessType(illnessType: string) {
		this.healthService.selectedIllness = illnessType;
		this.setIllnessTypeSubPath(illnessType);
		this.setInitialPath();
	}

	setIllnessTypeSubPath(illnessType) {
		const illnessTypeSubPath = HealthService.getIllnessTypeQueryParameterByIllnessType(illnessType);
		if (illnessTypeSubPath === null) {
			console.error('INVALID ILLNESS TYPE!');
		}

		this.illnessTypeSubPath = illnessTypeSubPath;
	}

	private setInitialPath() {
		this.selectedRoute = this.getInspectionsPath();
	}

	getInspectionsPath(): string {
		return this.getPath('/inspections');
	}

	getFailedImportsPath(): string {
		return this.getPath('/failed_imports-csv');
	}

	private getPath($subPath: string): string {
		return '/health/' + this.illnessTypeSubPath + $subPath;
	}

	static getIllnessSubPath(illnessType): string {
		return HealthService.getIllnessTypeQueryParameterByIllnessType(illnessType);
	}

	static getInspectionsPathByIllnessType(illnessType): string {
		return '/health/' + IllnessBaseComponent.getIllnessSubPath(illnessType) + '/inspections';
	}

}