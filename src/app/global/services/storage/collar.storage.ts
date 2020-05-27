import { NSFOService } from '../nsfo/nsfo.service';
import { Injectable } from '@angular/core';

import _ = require('lodash');
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class CollarStorage {

	collarColors = [];
	loadingCollarColors = false;

	private requestSub: Subscription;

	constructor(private nsfo: NSFOService) {
		this.getCollarColorList();
	}

	ngOnDestroy() {
		this.requestSub.unsubscribe();
	}

	refreshCollars() {
		this.getCollarColorList();
	}

	private getCollarColorList() {
		this.loadingCollarColors = true;
		this.requestSub = this.nsfo
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