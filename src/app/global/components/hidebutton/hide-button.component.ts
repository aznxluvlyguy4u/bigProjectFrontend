import { Component, Input, EventEmitter, Output } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';

@Component({
	selector: 'app-hide-button',
	template: require('./hide-button.component.html'),
	pipes: [TranslatePipe]
})
export class HideButtonComponent {
	showSuccess: boolean = false;

	@Input() title: string = 'HIDE';
	@Input() labelText: string = 'HIDE';

	@Input() isTiny: boolean = false;
	@Input() isActive: boolean = true;
	@Input() isExpanded: boolean = false;
	@Input() showSpinner: boolean = false;

	// Block user actions and display some animations
	@Input() includeDelayedSpinnerAnimation: boolean = false;
	@Input() spinnerDurationSeconds: number = 0.5;
	@Input() successDurationSeconds: number = 3;
	private timedIsActive: boolean = true;

	@Output() click = new EventEmitter();

	active() {
			return this.isActive && this.timedIsActive;
	}

	onClickyClick() {

			if (!this.active()) {
					console.log('IS NOT ACTIVE');
					return;
			}
		console.log('IS ACTIVE');

			if (!this.includeDelayedSpinnerAnimation) {
					this.click.emit(true);
					return;
			}

			this.timedIsActive = false;
			this.showSuccess = false;
			this.showSpinner = true;

			setTimeout(() => {
				this.showSpinner = false;
				this.showSuccess = true;

				// Prevent double clicking
				if (this.timedIsActive) {
					this.click.emit();
				}

				setTimeout(() => {
					this.showSuccess = false;
					this.timedIsActive = true;

				}, this.successDurationSeconds * 1000);

			}, this.spinnerDurationSeconds * 1000);


	}
}