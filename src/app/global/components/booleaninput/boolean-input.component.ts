import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';

@Component({
	selector: 'app-boolean-input',
	template: require('./boolean-input.component.html'),
	pipes: [TranslatePipe]
})
export class BooleanInputComponent {
	@Input() allowNull = false;
	@Input() boolVal: boolean;
	@Output() boolValChanged = new EventEmitter<boolean>();

	isEmpty() {
		return this.boolVal == null || this.boolVal == undefined;
	}

	toggle() {
		switch (this.boolVal) {
			case true:
				this.boolVal = false;
				break;

			case false:
				this.boolVal = this.allowNull ? null : true;
				break;

			default:
				this.boolVal = true;
				break;
		}

		this.boolValChanged.emit(this.boolVal);
	}
}