import { NSFOService } from '../nsfo/nsfo.service';
import { Location } from '../../../main/client/client.model';

import _ = require("lodash");
import { Injectable } from '@angular/core';

@Injectable()
export class LocationStorage {

		locationsActiveOnly: Location[] = [];
		// locationsAll: Location[] = [];
		loadingLocations = false;

		constructor(private nsfo: NSFOService) {
				this.getLocations();
		}

		refreshLocations() {
				this.getLocations();
		}

		private getLocations(): void {
			this.loadingLocations = true;

			// only get active ubns.
			// For inactive ubns add "?active_only=false"
			const query = '?active_only=false';
			this.nsfo.doGetRequest(this.nsfo.URI_UBNS + query)
				.subscribe(
					res => {
						const locations = <Location[]> res.result;

						// Activate this when necessary
						// this.locationsAll = locations;
						this.locationsActiveOnly = _.filter(locations, {is_active: true});

						this.loadingLocations = false;
					},
					error => {
						alert(this.nsfo.getErrorMessage(error));
						this.loadingLocations = false;
					}
				);
		}

}