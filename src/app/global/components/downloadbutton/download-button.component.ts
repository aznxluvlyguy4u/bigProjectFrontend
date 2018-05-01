import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';

@Component({
	selector: "app-download-button",
	template: require('./download-button.component.html'),
	pipes: [TranslatePipe]
})
export class DownloadButtonComponent implements OnInit{
	private isActive: boolean = true;
	private showSuccess: boolean = false;
	private showSpinner: boolean = false;

	@Input() spinnerDurationSeconds: number = 0.5;
	@Input() successDurationSeconds: number = 3;
	@Input() labelText: string = 'DOWNLOAD';
	@Input() includeBadgeCount: boolean = false;
	@Input() badgeCount: number = 0;
	@Input() fontSize: string = '10px';
	@Input() includeDownloadIcon: boolean = false;
	@Input() title: string = 'download';
	@Input() isExpandedButton: boolean = true;

	@Input() extraDisabledCriteria: boolean = false;

	@Input() buttonSizeClass = 'tiny';

	@Output() click = new EventEmitter();

	ngOnInit() {
			if (this.includeBadgeCount && this.badgeCount > 0) {
					this.isActive = false;
			} else {
					this.isActive = true;
			}
	}

	disableButton() {
			if (!this.isActive || this.extraDisabledCriteria) {
				 return true;
			}

			if (this.includeBadgeCount) {
				 return !(this.badgeCount > 0);
			}

			return false;
	}

	onClickyClick() {

			if (!this.isActive) {
					return;
			}

			this.isActive = false;
			this.showSuccess = false;
			this.showSpinner = true;

			setTimeout(() => {
					this.showSpinner = false;
					this.showSuccess = true;

					// Prevent double clicking
					if (this.isActive) {
							this.click.emit(true);
					}

					setTimeout(() => {
						this.showSuccess = false;
						this.isActive = true;

					}, this.successDurationSeconds * 1000);

			}, this.spinnerDurationSeconds * 1000);
	}

}