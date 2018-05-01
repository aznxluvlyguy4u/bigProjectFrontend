import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';

@Component({
		selector: 'app-http-call-button',
		template: require('./http-call-button.component.html'),
		pipes: [TranslatePipe]
})
export class HttpCallButtonComponent {
		@Input() labelText: string = 'GO!';
		@Input() processing = false;
		@Input() disabled: boolean;

		@Output() click = new EventEmitter();

		onClickyClick() {
				this.click.emit(true);
		}
}