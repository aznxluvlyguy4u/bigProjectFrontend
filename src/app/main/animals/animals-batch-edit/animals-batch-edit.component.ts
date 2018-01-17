import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { TranslatePipe } from 'ng2-translate';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NSFOService } from '../../../global/services/nsfo/nsfo.service';
import { AnimalDetailsResult } from './get-animal.model';
import { AnimalsResult } from './animals-result.model';
import { GetAnimalsBody } from './get-animals-body.model';
import { Animal } from '../../../global/components/livestock/livestock.model';

import _ = require("lodash");
import { UlnInputComponent } from '../../../global/components/ulninput/uln-input.component';

@Component({
		directives: [REACTIVE_FORM_DIRECTIVES, UlnInputComponent],
		template: require('./animals-batch-edit.component.html'),
		pipes: [TranslatePipe]
})
export class AnimalsBatchEditComponent implements OnInit, OnDestroy {
		getAnimalsBody: GetAnimalsBody;
		retrievedAnimals: Animal[];
		editedAnimals: Animal[];
		private animalsResult: AnimalsResult;
		private isAnimalsLoaded: boolean;
		isSaving: boolean;
		countryCodeList = [];

		showIds: boolean;
		showBreedData: boolean;
		showPedigreeData: boolean;
		showLocationData: boolean;
		showNote: boolean;
		showDates: boolean;

		allowUlnEdit: boolean;

		constructor(private nsfo: NSFOService) {}

		private initializeValues() {
				this.isAnimalsLoaded = false;
				this.getAnimalsBody = new GetAnimalsBody();
				this.getAnimalsBody.separator = ',';
				this.animalsResult = new AnimalsResult();
				this.isSaving = false;

				// TODO edit later
				this.showIds = true;
				this.showBreedData = true;
				this.showPedigreeData = true;
				this.showLocationData = true;
				this.showNote = true;
				this.showDates = true;

				this.allowUlnEdit = false;
		}

		ngOnInit() {
				this.initializeValues();
				this.doGetCountryCodeList();

				//TODO remove later
				this.getAnimalsBody.plain_text_input = ' NL 00189-75741   , NL 100126232800   , NL 109992775741 , NL 109993894618, UK 9JK3843, NL DDD33-25466DD , NL 100020389194, NL 03215-07224 ,    NL 00189-4FDSF';

				this.getAnimals();
		}

		ngOnDestroy() {
				this.initializeValues();
		}

		isDataLoaded() {
				return this.isAnimalsLoaded;
		}

		private getAnimals() {
				const queryParam = '?plain_text_input=true';

				this.nsfo.doPostRequest(this.nsfo.URI_ANIMALS + queryParam, this.getAnimalsBody)
					.subscribe(
					res => {
									this.retrievedAnimals = res.result.animals;
									this.editedAnimals = res.result.animals;
									this.animalsResult.invalid = res.result.invalid;
									this.animalsResult.stns_without_found_animals = res.result.stns_without_found_animals;
									this.animalsResult.ulns_without_found_animals = res.result.ulns_without_found_animals;
							}, error => {
									alert(this.nsfo.getErrorMessage(error));
							}
					);
		}

		private doGetCountryCodeList() {
				this.nsfo.doGetRequest(this.nsfo.URI_GET_COUNTRY_CODES)
					.subscribe(
						res => {
							this.countryCodeList = _.sortBy(res.result, ['code']);
						},
						error => {
							alert(this.nsfo.getErrorMessage(error));
						}
					);
		}
}