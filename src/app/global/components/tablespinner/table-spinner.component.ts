import { Component, Input } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
	selector: 'app-table-spinner',
	template: require('./table-spinner.component.html'),
	directives: [SpinnerComponent],
	pipes: [TranslatePipe]
})
export class TableSpinnerComponent {
	@Input() isActive: boolean;
	@Input() showLoadingText = false;
}