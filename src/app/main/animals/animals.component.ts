import { TranslatePipe } from 'ng2-translate';
import { Component } from '@angular/core';
import { Router, ROUTER_DIRECTIVES } from '@angular/router';

@Component({
	directives: [ROUTER_DIRECTIVES],
	template: require('./animals.component.html'),
	pipes: [TranslatePipe]
})
export class AnimalsComponent {
	private selectedRoute: string = '/animals/animal-edit';

	constructor(private router: Router) {}

	private navigateTo(url: string) {
		this.router.navigate([url]);
	}
}