import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';

@Component({
	selector: 'app-info-button',
	template: require('./info-button.component.html'),
	pipes: [TranslatePipe]
})
export class InfoButtonComponent {
	@Input() isActive = true;
	@Input() title = 'INFO';
	@Input() isTiny = true;

	@Output() click = new EventEmitter();

	onClickyClick() {
			this.click.emit(true);
	};
}
