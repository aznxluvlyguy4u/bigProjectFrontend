import { Component, Input } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';

@Component({
	selector: 'app-spinner',
	template: require('./spinner.component.html'),
	pipes: [TranslatePipe]
})
export class SpinnerComponent {
	@Input() showLoadingText = false;
}