import { NSFOService } from '../nsfo/nsfo.service';
import { PedigreeRegister } from '../../models/pedigree-register.model';
import { Injectable } from '@angular/core';

import _ = require('lodash');
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class PedigreeRegisterStorage {

	pedigreeRegisters: PedigreeRegister[] = [];

	private requestSub: Subscription;

	constructor(private api: NSFOService) {}

	ngOnDestroy() {
		if (this.requestSub) {
			this.requestSub.unsubscribe();
		}
	}

	initialize() {
		if (this.pedigreeRegisters.length === 0) {
			this.refresh();
		}
	}

	refresh() {
		this.doGetPedigreeRegisters();
	}

	private doGetPedigreeRegisters() {
		this.requestSub = this.api.doGetRequest(this.api.URI_PEDIGREE_REGISTERS)
			.subscribe(
				res => {
					this.pedigreeRegisters = res.result;
				},
				error => {
					alert(this.api.getErrorMessage(error));
				}
			);
	}

	getById(id: number): PedigreeRegister {
		if (id == null) {
			return null;
		}

		if (typeof id === 'string') {
			// convert the string to a number
			id = +id;
		}

		return _.find(this.pedigreeRegisters,{id: id} );
	}

	static arePedigreeRegistersEqual(p1: PedigreeRegister, p2: PedigreeRegister): boolean {
		if (p1 == null) {
			return p2 == null;

		} else {
			if (p2 == null) {
				return false;
			}

			return p1.id === p2.id
				&& p1.abbreviation === p2.abbreviation
				&& p1.full_name === p2.full_name
			;
		}
	}
}