import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { TranslatePipe, TranslateService } from 'ng2-translate';
import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { NSFOService } from '../../../global/services/nsfo/nsfo.service';
import { AnimalDetailsResult } from './get-animal.model';
import { AnimalsResult } from './animals-result.model';
import { GetAnimalsBody } from './get-animals-body.model';
import { Animal } from '../../../global/components/livestock/livestock.model';

import _ = require("lodash");
import { UlnInputComponent } from '../../../global/components/ulninput/uln-input.component';
import { StnInputComponent } from '../../../global/components/stninput/stn-input.component';
import { HttpCallButtonComponent } from '../../../global/components/httpcallbutton/http-call-button.component';

@Component({
		directives: [REACTIVE_FORM_DIRECTIVES, UlnInputComponent, StnInputComponent,
			HttpCallButtonComponent],
		template: require('./animals-batch-edit.component.html'),
		pipes: [TranslatePipe]
})
export class AnimalsBatchEditComponent implements OnInit, OnDestroy {
		getAnimalsBody: GetAnimalsBody;
		retrievedAnimals: Animal[];
		editedAnimals: Animal[];
		filteredAnimals: Animal[];
		private animalsResult: AnimalsResult;

		private isAnimalsLoaded: boolean;
		isSaving: boolean;

		showIds: boolean;
		showBreedData: boolean;
		showPedigreeData: boolean;
		showNote: boolean;
		showDates: boolean;
		showExaminationData: boolean;
		showHealthData: boolean;

		allowUlnEdit: boolean;

		openOptions: boolean;
		openFilters: boolean;

		initialValuesChanged = new EventEmitter<boolean>();

		constructor(private nsfo: NSFOService, private translate: TranslateService) {}

		private initializeValues() {
				this.retrievedAnimals = [];
				this.editedAnimals = [];
				this.filteredAnimals = [];

				this.isAnimalsLoaded = false;
				this.getAnimalsBody = new GetAnimalsBody();
				this.getAnimalsBody.separator = ',';
				this.animalsResult = new AnimalsResult();
				this.isSaving = false;

				// TODO edit later
				this.showIds = true;
				this.showBreedData = true;
				this.showPedigreeData = true;
				this.showNote = true;
				this.showDates = true;
				this.showExaminationData = true;
				this.showHealthData = true;

				this.allowUlnEdit = false;
				this.openOptions = true;
				this.openFilters = false;
		}

		ngOnInit() {
				this.initializeValues();

				//TODO remove later
				this.getAnimalsBody.plain_text_input = ' NL 00189-75741   , NL 100126232800   , NL 109992775741 , NL 109993894618, UK 9JK3843, NL DDD33-25466DD , NL 100020389194, NL 03215-07224 ,    NL 00189-4FDSF';

				this.getAnimals();
		}

		ngOnDestroy() {
				this.initializeValues();
		}

		isDataLoaded() {
				return this.isAnimalsLoaded
					&& this.filteredAnimals.length > 0;
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

									this.animalsListWasUpdated();

									//TODO remove after we have actual filtered animals
									// this.filteredAnimals = this.editedAnimals;
									this.filteredAnimals = res.result.animals;

									}, error => {
									alert(this.nsfo.getErrorMessage(error));
							}
					);
		}


		doPutUpdateAnimals() {

				if (this.isSaving) {
						return;
				}

				this.isSaving = true;

				//TODO return real filtered animals
				this.filteredAnimals = this.editedAnimals;

				const updateBody = {
						animals: this.filteredAnimals
				};

				this.nsfo.doPutRequest(this.nsfo.URI_ANIMALS_DETAILS, updateBody)
						.subscribe(
							res => {

								this.updateAnimals(res.result.animals.updated);
								this.updateAnimals(res.result.animals.non_updated);

								if(!res.result.successful_update_secondary_values) {
										alert(this.translate.instant('UPDATE ANIMALS SECONDARY VALUES WARNING'));
								}

								this.displayUpdateResults(res);

								this.animalsListWasUpdated();
								this.isSaving = false;

								}, error => {
										alert(this.nsfo.getErrorMessage(error));
										this.isSaving = false;
								}
					);
		}


		private updateAnimals(updatedAnimalSet: Animal[]) {
				if (updatedAnimalSet == null || updatedAnimalSet.length === 0) {
						return;
				}

				for(let animal of updatedAnimalSet) {
						const indexA = _.findIndex(this.retrievedAnimals, {id: animal.id});
						this.retrievedAnimals.splice(indexA, 1, animal);

						const indexB = _.findIndex(this.editedAnimals, {id: animal.id});
						this.editedAnimals.splice(indexB, 1, animal);
				}
		}


		private displayUpdateResults(res: any) {
			alert(
				this.translate.instant('SENT ANIMALS UPDATED') + ': '
				+ res.result.animals.updated.length + '\n' +
				this.translate.instant('SENT ANIMALS NOT UPDATED') + ': '
				+ res.result.animals.not_updated.length
			);
		}


		private animalsListWasUpdated() {
				this.isAnimalsLoaded = true;
				this.initialValuesChanged.emit(true);
		}

}