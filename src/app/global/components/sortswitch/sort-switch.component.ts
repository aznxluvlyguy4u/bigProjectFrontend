import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-sort-switch',
	template: require('./sort-switch.component.html')
})
export class SortSwitchComponent {
	@Input() pointsUp: boolean;
	@Input() neutral: boolean = false;
	@Output() sortSwitchToggled = new EventEmitter<boolean>();

	onClick() {
		this.sortSwitchToggled.emit(true);
	}
}