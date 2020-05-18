import { Injectable } from '@angular/core';
import { Animal } from '../../components/livestock/livestock.model';

import _ = require('lodash');
import { FormatService } from '../utils/format.service';
import { NSFOService } from '../nsfo/nsfo.service';
import { TranslateService } from 'ng2-translate';
import { Subject } from 'rxjs/Subject';
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class ParentsStorage {

	parents: Animal[] = [];

	getByUlnChanged = new Subject<Animal>();

	private requestSub: Subscription;

	constructor(private api: NSFOService, private translator: TranslateService) {}

	ngOnDestroy() {
		this.requestSub.unsubscribe();
	}

	clear() {
		this.parents = [];
	}

	getById(id: number): Animal {
		if (id == null) {
			return null;
		}
		return _.find(this.parents, {id: FormatService.getFormatCheckedNumber(id)});
	}

	update(animal: Animal) {
		if (animal == null || animal.id == null) {
			return;
		}

		const animalId =  FormatService.getFormatCheckedNumber(animal.id);

		const index = _.findIndex(this.parents, {id: animalId});
		if (index === -1) {
			this.parents.push(animal);
		} else {
			this.parents[index] = animal;
		}
	}

	getByUln(ulnCountryCode: string, ulnNumber: string, genderType?: string) {

		const parent = _.find(this.parents, {uln_country_code: ulnCountryCode, uln_number: ulnNumber});
		if (parent) {
			this.getByUlnNotifyIfGenderMatches(parent, genderType);
			return;
		}

		this.requestSub = this.api.doGetRequest(this.api.URI_ANIMALS_DETAILS + '/' + ulnCountryCode + ulnNumber
			+ '?minimal_output=true&is_admin_env=true')
			.subscribe(
				res => {
					const parent = res.result;
					this.update(parent);

					this.getByUlnNotifyIfGenderMatches(parent, genderType);
				},
				error => {
					alert(this.api.getErrorMessage(error));
					this.notifyGetByUlnChanged(null);
				}
			);
	}

	private getByUlnNotifyIfGenderMatches(parent: Animal, genderType?: string) {
		if (genderType && parent.type !== genderType) {
			alert(this.translator.instant('ANIMAL WAS FOUND, BUT HAD INCORRECT GENDER'));
			this.notifyGetByUlnChanged(null);
		} else {
			this.notifyGetByUlnChanged(parent);
		}
	}

	private notifyGetByUlnChanged(parent: Animal) {
		this.getByUlnChanged.next(parent);
	}
}