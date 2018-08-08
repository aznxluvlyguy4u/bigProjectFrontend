import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { LocationStorage } from '../../services/storage/LocationStorage';
import { UbnDropdownPipes } from '../../pipes/ubn-dropdown.pipes';
import { Location } from '../../../main/client/client.model';
import { SpinnerComponent } from '../spinner/spinner.component';

import _ = require('lodash');

@Component({
	selector: 'app-ubn-dropdown',
	template: require('./ubn-dropdown.component.html'),
	directives: [SpinnerComponent],
	pipes: [TranslatePipe, UbnDropdownPipes]
})
export class UbnDropdownComponent {
		@Input() labelText = '';
		@Input() isOptional = false;
		@Input() isActive = true;
		isDirty = false;
		@Input() idSuffix = '1';

		@Output() selectedLocationChange = new EventEmitter<Location>();

		selectedLocation: Location;
		selectedUbn: string;

		constructor(private locationStorage: LocationStorage) {}

		getLocations() {
				return this.locationStorage.locationsActiveOnly;
		}

		isLocationsLoading() {
				return this.locationStorage.loadingLocations;
		}

		setEmptyLocation() {
				if (this.isActive) {
						this.selectedLocation = null;
						this.selectedUbn = null;
						this.selectedLocationChange.emit(null	);
				}
				this.isDirty = false;
		}

		onClickyClick() {
				if (this.selectedUbn) {
						this.selectedLocation = _.find(this.getLocations(), {ubn: this.selectedUbn});
				} else {
						this.selectedLocation = null;
				}

				this.selectedLocationChange.emit(this.selectedLocation);
		}
}