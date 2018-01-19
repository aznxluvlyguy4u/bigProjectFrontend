import { NSFOService } from '../nsfo/nsfo.service';
import { Injectable } from '@angular/core';

import _ = require('lodash');

@Injectable()
export class CollarStorage {

	collarColors = [];
	loadingCollarColors = false;

	constructor(private nsfo: NSFOService) {
		this.getCollarColorList();
	}

	refreshCollars() {
		this.getCollarColorList();
	}

	private getCollarColorList() {
		this.loadingCollarColors = true;
		this.nsfo
			.doGetRequest(this.nsfo.URI_GET_COLLAR_COLORS)
			.subscribe(
				res => {
					this.collarColors = _.map(res.result, 'name');
					this.loadingCollarColors = false;
				},
				error => {
					alert(this.nsfo.getErrorMessage(error));
					this.loadingCollarColors = false;
				}
			);
	}


}