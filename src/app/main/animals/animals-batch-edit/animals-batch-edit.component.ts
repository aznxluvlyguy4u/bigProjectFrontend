import { REACTIVE_FORM_DIRECTIVES, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from 'ng2-translate';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { NSFOService } from '../../../global/services/nsfo/nsfo.service';
import { AnimalsResult } from './animals-result.model';
import { GetAnimalsBody } from './get-animals-body.model';
import { Animal } from '../../../global/components/livestock/livestock.model';

import _ = require("lodash");
import { UlnInputComponent } from '../../../global/components/ulninput/uln-input.component';
import { StnInputComponent } from '../../../global/components/stninput/stn-input.component';
import { HttpCallButtonComponent } from '../../../global/components/httpcallbutton/http-call-button.component';
import { StartInputModalComponent } from './start-input-modal/start-input-modal.component';
import { TableSpinnerComponent } from '../../../global/components/tablespinner/table-spinner.component';
import { Location } from '../../client/client.model';
import { LocationStorage } from '../../../global/services/storage/LocationStorage';
import { BIRTH_PROGRESS_TYPES } from '../../../global/constants/birth-progress-types.constant';
import { BREED_TYPES } from '../../../global/constants/breed-type.constant';
import { CollarInputComponent } from '../../../global/components/collarinput/collar-input.component';
import { BooleanInputComponent } from '../../../global/components/booleaninput/boolean-input.component';
import { DatepickerV2Component } from '../../../global/components/datepickerV2/datepicker-v2.component';
import { SettingsService } from '../../../global/services/settings/settings.service';
import { BLINDNESS_FACTOR_TYPES } from '../../../global/constants/blindness-factor-type.constant';
import { MYO_MAX_TYPES } from '../../../global/constants/myo-max-type.constant';
import { SCRAPIE_GENOTYPES } from '../../../global/constants/scrapiegenotype.constant';
import { PREDICATE_TYPE } from '../../../global/constants/predicate-type.constant';
import { UbnDropdownComponent } from '../../../global/components/ubndropdown/ubn-dropdown.component';
import { AnimalsBatchEditFilterPipe } from './pipes/animals-batch-edit-filter.pipe';
import { PaginatePipe, PaginationService } from 'ng2-pagination';
import { PaginationComponent } from '../../../global/components/pagination/pagination.component';
import { SearchComponent } from '../../../global/components/searchbox/seach-box.component';
import { GENDER_TYPES } from '../../../global/constants/gender-type.contant';
import { PedigreeRegisterStorage } from '../../../global/services/storage/pedigree-register.storage';
import { PedigreeRegisterDropdownComponent } from '../../../global/components/pedigreeregisterdropdown/pedigree-register-dropdown.component';
import { ParentSelectorComponent } from '../../../global/components/parentselector/parent-selector.component';
import { ParentsStorage } from '../../../global/services/storage/parents.storage';
import { AnimalReportDownloaderComponent } from '../../../global/components/animalreportdownloader/animal-report-downloader.component';
import { AnimalReportDownloaderService } from '../../../global/services/download/animal-report-downloader.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
		providers: [PaginationService, AnimalsBatchEditFilterPipe],
		directives: [REACTIVE_FORM_DIRECTIVES, UlnInputComponent, StnInputComponent, AnimalReportDownloaderComponent,
			HttpCallButtonComponent, StartInputModalComponent, TableSpinnerComponent, CollarInputComponent,
			BooleanInputComponent, DatepickerV2Component, UbnDropdownComponent, PaginationComponent,
			SearchComponent, PedigreeRegisterDropdownComponent, ParentSelectorComponent],
		template: require('./animals-batch-edit.component.html'),
		pipes: [TranslatePipe, AnimalsBatchEditFilterPipe, PaginatePipe]
})
export class AnimalsBatchEditComponent implements OnInit, OnDestroy {
		retrievedAnimals: Animal[];
		editedAnimals: Animal[];
		filteredAnimals: Animal[];
		locations: Location[];
		private animalsResult: AnimalsResult;

		isAnimalsLoaded: boolean;
		isSaving: boolean;
		loadingLocations: boolean;
		retrievingAnimals: boolean;

		birthProgressTypes: string[] = BIRTH_PROGRESS_TYPES;
		breedTypes: string[] = BREED_TYPES;
		blindnessFactorTypes: string[] = BLINDNESS_FACTOR_TYPES;
		myoMaxTypes: string[] = MYO_MAX_TYPES;
		scrapieGenotypes: string[] = SCRAPIE_GENOTYPES;
		predicateTypes: string[] = PREDICATE_TYPE;
		genderTypes: string[] = GENDER_TYPES;

		showIds: boolean;
		showPedigreeRegisterData: boolean;
		showPedigreeData: boolean;
		showNote: boolean;
		showDates: boolean;
		showExaminationData: boolean;
		showHealthData: boolean;

		allowUlnEdit: boolean;
		isBatchEditActive: boolean;
		batchAnimal: Animal;

		openOptions: boolean;
		openFilters: boolean;

		displayStartInputModal: string;
		displayBatchLocationEditModal: string;
		displayBatchLocationOfBirthEditModal: string;
		displayBatchPedigreeRegisterEditModal: string;
		displayIncorrectGetInputModal: string;

		initialValuesChanged = new EventEmitter<boolean>();
		resetPedigreeRegisterValues = new EventEmitter<boolean>();
		retrievedNewAnimalsBatch = new EventEmitter<boolean>();


		batchCurrentLocationIsActive: boolean;
		batchIsAliveIsActive: boolean;
		batchNoteIsActive: boolean;
		batchPedigreeRegisterIsActive: boolean;
		batchUbnOfBirthIsActive: boolean;
		batchLocationOfBirthIsActive: boolean;
		batchLambarIsActive: boolean;
		batchBirthProgressIsActive: boolean;
		batchBreedTypeIsActive: boolean;
		batchBreedCodeIsActive: boolean;
		batchPredicateIsActive: boolean;
		batchPredicateScoreIsActive: boolean;
		batchScrapieGenotypeIsActive: boolean;
		batchBlindnessFactorIsActive: boolean;
		batchMyoMaxIsActive: boolean;

		page: number;

		filterAmount: number = 10;
		filterAmountOptions = [10, 25, 50];

		filterUlnCountryCode: string;
		filterUlnNumber: string;
		filterPedigreeCountryCode: string;
		filterPedigreeNumber: string;
		filterCollarNumber: string;
		filterCollarColor: string;
		filterNickName: string;
		filterId: number;
		filterAiind: number;
		filterGenderType: string;
		filterCurrentLocationUbn: string;
		filterIsAlive: boolean;
		filterNote: string;
		filterUbnOfBirth: number;
		filterLocationOfBirthUbn: string;
		filterBreedType: string;
		filterBreedCode: string;
		filterPredicate: string;
		filterPredicateScore: number;

		private onDestroy$: Subject<void> = new Subject<void>();

		constructor(private nsfo: NSFOService,
								private translate: TranslateService,
								private locationStorage: LocationStorage,
								private pedigreeRegisterStorage: PedigreeRegisterStorage,
								private parentStorage: ParentsStorage,
								private filterPipe: AnimalsBatchEditFilterPipe,
								private animalReportDownloaderService: AnimalReportDownloaderService,
								private settings: SettingsService) {}

		private initializeValues() {
				this.page = 1;

				this.retrievedAnimals = [];
				this.editedAnimals = [];
				this.filteredAnimals = [];
				this.locations = [];
				this.resetBatchEditOptions();

				this.isAnimalsLoaded = false;
				this.animalsResult = new AnimalsResult();
				this.isSaving = false;
				this.retrievingAnimals = false;
				this.loadingLocations = false;

				this.showIds = true;
				this.showPedigreeRegisterData = true;
				this.showPedigreeData = true;
				this.showNote = true;
				this.showDates = true;
				this.showExaminationData = true;
				this.showHealthData = true;
				this.isBatchEditActive = true;

				this.allowUlnEdit = false;
				this.openOptions = true;
				this.openFilters = false;

				this.displayStartInputModal = 'block';
				this.displayBatchLocationEditModal = 'none';
				this.displayBatchLocationOfBirthEditModal = 'none';
				this.displayBatchPedigreeRegisterEditModal = 'none';
				this.displayIncorrectGetInputModal = 'none';

				this.batchCurrentLocationIsActive = false;
				this.batchIsAliveIsActive = false;
				this.batchNoteIsActive = false;
				this.batchPedigreeRegisterIsActive = false;
				this.batchUbnOfBirthIsActive = false;
				this.batchLocationOfBirthIsActive = false;
				this.batchLambarIsActive = false;
				this.batchBirthProgressIsActive = false;
				this.batchBreedTypeIsActive = false;
				this.batchBreedCodeIsActive = false;
				this.batchPredicateIsActive = false;
				this.batchPredicateScoreIsActive = false;
				this.batchScrapieGenotypeIsActive = false;
				this.batchBlindnessFactorIsActive = false;
				this.batchMyoMaxIsActive = false;

				this.resetFilterOptions();
		}

		ngOnInit() {
				this.initializeValues();
				this.getGeneralData();
		}

		ngOnDestroy() {
			this.initializeValues();
			this.parentStorage.clear();
			this.onDestroy$.next();
			this.onDestroy$.complete();
		}

		isDataLoaded() {
				return this.isAnimalsLoaded
					&& this.filteredAnimals.length > 0;
		}

		getGeneralData() {
				this.locationStorage.refreshLocations();
				this.pedigreeRegisterStorage.initialize();
		}

		getLocations(): Location[] {
				return this.locationStorage.locationsActiveOnly;
		}

		isLocationsLoading(): boolean {
				return this.locationStorage.loadingLocations;
		}

		getAnimals(getAnimalsBody: GetAnimalsBody) {
				this.displayStartInputModal = 'none';
				this.retrievingAnimals = true;
				const queryParam = '?plain_text_input=true';

				this.nsfo.doPostRequest(this.nsfo.URI_ANIMALS + queryParam, getAnimalsBody)
					.pipe(takeUntil(this.onDestroy$))
					.subscribe(
					res => {
									this.retrievedAnimals = res.result.animals;
									this.editedAnimals = _.cloneDeep(this.retrievedAnimals);
									this.animalsResult.invalid = res.result.invalid;
									this.animalsResult.stns_without_found_animals = res.result.stns_without_found_animals;
									this.animalsResult.ulns_without_found_animals = res.result.ulns_without_found_animals;

									this.animalsListWasUpdated();

									this.updateFilterAnimals();
									this.retrievingAnimals = false;

									if (this.hasInputErrors()) {
										this.openIncorrectGetInputModal();
									}

									this.retrievedNewAnimalsBatch.emit(true);
								},
							error => {
									alert(this.nsfo.getErrorMessage(error));
									this.retrievingAnimals = false;
							}
					);
		}

		hasInputErrors() {
			if (this.animalsResult != null
			&& this.animalsResult.invalid  != null
			&& this.animalsResult.ulns_without_found_animals  != null
			&& this.animalsResult.stns_without_found_animals  != null
			) {
				return this.animalsResult.invalid.length > 0
					|| this.animalsResult.ulns_without_found_animals.length > 0
					|| this.animalsResult.stns_without_found_animals.length > 0
					;
			}
			return false;
		}

		updateFilterAnimals() {
			this.filteredAnimals = this.filterPipe.transform(this.editedAnimals, this.getFilterOptions());
		}

		doPutUpdateAnimals() {

				if (this.isSaving) {
						return;
				}

				this.isSaving = true;
				this.updateFilterAnimals();

				const updateBody = {
						animals: this.filteredAnimals
				};

				this.nsfo.doPutRequest(this.nsfo.URI_ANIMALS_DETAILS, updateBody)
						.pipe(takeUntil(this.onDestroy$))
						.subscribe(
							res => {

								this.updateAnimals(res.result.animals.updated);
								this.updateAnimals(res.result.animals.not_updated);

								this.updateAnimalsAlertMessageCheck(res);

								this.displayUpdateResults(res);

								this.animalsListWasUpdated();
								this.isSaving = false;

								}, error => {
										alert(this.nsfo.getErrorMessage(error));
										this.isSaving = false;
								}
					);
		}


		private updateAnimalsAlertMessageCheck(res): void {
			let alertMessage = '';
			let prefix = '';
			if (!res.result.successful_update_secondary_values) {
				alertMessage += prefix + this.translate.instant('UPDATE ANIMALS SECONDARY VALUES WARNING');
				prefix = '. ';
			}
			if (!res.result.successful_update_result_table_values) {
				alertMessage += prefix + this.translate.instant('UPDATE ANIMALS RESULT TABLE VALUES WARNING');
				prefix = '. ';
			}
			if (alertMessage !== '') {
				alertMessage += '.';
				alert(alertMessage);
			}
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
			  this.page = 1;
				this.isAnimalsLoaded = true;
				this.initialValuesChanged.emit(true);
		}

		resetAnimals() {
			this.editedAnimals = _.cloneDeep(this.retrievedAnimals);
			this.animalsListWasUpdated();
			this.resetBatchEditOptions();
		}

		getFilterOptions() {
			return [
				this.filterUlnCountryCode + this.filterUlnNumber,
				this.filterPedigreeCountryCode + this.filterPedigreeNumber,
				this.filterCollarNumber,
				this.filterCollarColor,
				this.filterNickName,
				this.filterId,
				this.filterAiind,
				this.filterGenderType,
				this.filterCurrentLocationUbn,
				this.filterIsAlive,
				this.filterNote,
				this.filterUbnOfBirth,
				this.filterLocationOfBirthUbn,
				this.filterBreedType,
				this.filterBreedCode,
				this.filterPredicate,
				this.filterPredicateScore,
			];
		}

		resetFilterOptions() {
			this.filterUlnCountryCode = '';
			this.filterUlnNumber = '';
			this.filterPedigreeCountryCode = '';
			this.filterPedigreeNumber = '';
			this.filterCollarNumber = '';
			this.filterCollarColor = '';
			this.filterNickName = '';
			this.filterId = null;
			this.filterAiind = null;
			this.filterGenderType = '';
			this.filterCurrentLocationUbn = null;
			this.filterIsAlive = null;
			this.filterNote = '';
			this.filterUbnOfBirth = 0;
			this.filterLocationOfBirthUbn = null;
			this.filterBreedType = '';
			this.filterBreedCode = '';
			this.filterPredicate = '';
			this.filterPredicateScore = 0;
		}

		resetBatchEditOptions() {
				this.batchAnimal = new Animal();
		}


		openBatchCurrentLocationModal() {
			this.displayBatchLocationEditModal = 'block';
		}

		closeBatchCurrentLocationModal() {
			this.displayBatchLocationEditModal = 'none';
		}

		openBatchLocationOfBirthModal() {
			this.displayBatchLocationOfBirthEditModal = 'block';
		}

		closeBatchLocationOfBirthModal() {
			this.displayBatchLocationOfBirthEditModal = 'none';
		}

		openBatchPedigreeRegisterModal() {
			this.displayBatchPedigreeRegisterEditModal = 'block';
		}

		closeIncorrectGetInputModal() {
			this.displayIncorrectGetInputModal = 'none';
		}

		openIncorrectGetInputModal() {
			this.displayIncorrectGetInputModal = 'block';
		}

		closeBatchPedigreeRegisterModal() {
			this.displayBatchPedigreeRegisterEditModal = 'none';
		}


		batchSetIsAlive() {
			for(let animal of this.editedAnimals) {
				animal.is_alive = this.batchAnimal.is_alive;
			}
		}

		batchSetNote() {
			for(let animal of this.editedAnimals) {
				animal.note = this.batchAnimal.note;
			}
		}

		batchSetPedigreeRegister() {
			for(let animal of this.editedAnimals) {
				animal.pedigree_register = this.batchAnimal.pedigree_register;
			}
		}

	batchSetUbnOfBirth() {
		for(let animal of this.editedAnimals) {
			animal.ubn_of_birth = this.batchAnimal.ubn_of_birth;
		}
	}

	batchSetLocationOfBirth() {
		for(let animal of this.editedAnimals) {
			animal.location_of_birth = this.batchAnimal.location_of_birth;
		}
	}

	batchSetCurrentLocation() {
		for(let animal of this.editedAnimals) {
			animal.location = this.batchAnimal.location;
		}
	}

	batchSetLambar() {
		for(let animal of this.editedAnimals) {
			animal.lambar = this.batchAnimal.lambar;
		}
	}

	batchSetBirthProgress() {
		for(let animal of this.editedAnimals) {
			animal.birth_progress = this.batchAnimal.birth_progress;
		}
	}

	batchSetBreedType() {
		for(let animal of this.editedAnimals) {
			animal.breed_type = this.batchAnimal.breed_type;
		}
	}

	batchSetBreedCode() {
		for(let animal of this.editedAnimals) {
			animal.breed_code = this.batchAnimal.breed_code;
		}
	}

	batchSetPredicate() {
		for(let animal of this.editedAnimals) {
			animal.predicate = this.batchAnimal.predicate;
		}
	}

	batchSetPredicateScore() {
		for(let animal of this.editedAnimals) {
			animal.predicate_score = this.batchAnimal.predicate_score;
		}
	}

	batchSetScrapieGenotype() {
		for(let animal of this.editedAnimals) {
			animal.scrapie_genotype = this.batchAnimal.scrapie_genotype;
		}
	}

	batchSetBlindnessFactor() {
		for(let animal of this.editedAnimals) {
			animal.blindness_factor = this.batchAnimal.blindness_factor;
		}
	}

	batchSetMyoMax() {
		for(let animal of this.editedAnimals) {
			animal.myo_max = this.batchAnimal.myo_max;
		}
	}


	batchResetIsAlive() {
		for(let animal of this.editedAnimals) {
			const retrievedAnimal = _.find(this.retrievedAnimals, {id: animal.id});
			if (retrievedAnimal) {
				animal.is_alive = retrievedAnimal.is_alive;
			}
		}
	}

	batchResetNote() {
		for(let animal of this.editedAnimals) {
			const retrievedAnimal = _.find(this.retrievedAnimals, {id: animal.id});
			if (retrievedAnimal) {
				animal.note = retrievedAnimal.note;
			}
		}
	}

	batchResetPedigreeRegister() {
		for(let animal of this.editedAnimals) {
			const retrievedAnimal = _.find(this.retrievedAnimals, {id: animal.id});
			if (retrievedAnimal) {
				animal.pedigree_register = retrievedAnimal.pedigree_register;
			}
		}
		this.resetPedigreeRegisterValues.emit(true);
	}

	batchResetUbnOfBirth() {
		for(let animal of this.editedAnimals) {
			const retrievedAnimal = _.find(this.retrievedAnimals, {id: animal.id});
			if (retrievedAnimal) {
				animal.ubn_of_birth = retrievedAnimal.ubn_of_birth;
			}
		}
	}

	batchResetLocationOfBirth() {
		for(let animal of this.editedAnimals) {
			const retrievedAnimal = _.find(this.retrievedAnimals, {id: animal.id});
			if (retrievedAnimal) {
				animal.location_of_birth = retrievedAnimal.location_of_birth;
			}
		}
	}

	batchResetCurrentLocation() {
		for(let animal of this.editedAnimals) {
			const retrievedAnimal = _.find(this.retrievedAnimals, {id: animal.id});
			if (retrievedAnimal) {
				animal.location = retrievedAnimal.location;
			}
		}
	}

	batchResetLambar() {
		for(let animal of this.editedAnimals) {
			const retrievedAnimal = _.find(this.retrievedAnimals, {id: animal.id});
			if (retrievedAnimal) {
				animal.lambar = retrievedAnimal.lambar;
			}
		}
	}

	batchResetBirthProgress() {
		for(let animal of this.editedAnimals) {
			const retrievedAnimal = _.find(this.retrievedAnimals, {id: animal.id});
			if (retrievedAnimal) {
				animal.birth_progress = retrievedAnimal.birth_progress;
			}
		}
	}

	batchResetBreedType() {
		for(let animal of this.editedAnimals) {
			const retrievedAnimal = _.find(this.retrievedAnimals, {id: animal.id});
			if (retrievedAnimal) {
				animal.breed_type = retrievedAnimal.breed_type;
			}
		}
	}

	batchResetBreedCode() {
		for(let animal of this.editedAnimals) {
			const retrievedAnimal = _.find(this.retrievedAnimals, {id: animal.id});
			if (retrievedAnimal) {
				animal.breed_code = retrievedAnimal.breed_code;
			}
		}
	}

	batchResetPredicate() {
		for(let animal of this.editedAnimals) {
			const retrievedAnimal = _.find(this.retrievedAnimals, {id: animal.id});
			if (retrievedAnimal) {
				animal.predicate = retrievedAnimal.predicate;
			}
		}
	}

	batchResetPredicateScore() {
		for(let animal of this.editedAnimals) {
			const retrievedAnimal = _.find(this.retrievedAnimals, {id: animal.id});
			if (retrievedAnimal) {
				animal.predicate_score = retrievedAnimal.predicate_score;
			}
		}
	}

	batchResetScrapieGenotype() {
		for(let animal of this.editedAnimals) {
			const retrievedAnimal = _.find(this.retrievedAnimals, {id: animal.id});
			if (retrievedAnimal) {
				animal.scrapie_genotype = retrievedAnimal.scrapie_genotype;
			}
		}
	}

	batchResetBlindnessFactor() {
		for(let animal of this.editedAnimals) {
			const retrievedAnimal = _.find(this.retrievedAnimals, {id: animal.id});
			if (retrievedAnimal) {
				animal.blindness_factor = retrievedAnimal.blindness_factor;
			}
		}
	}

	batchResetMyoMax() {
		for(let animal of this.editedAnimals) {
			const retrievedAnimal = _.find(this.retrievedAnimals, {id: animal.id});
			if (retrievedAnimal) {
				animal.myo_max = retrievedAnimal.myo_max;
			}
		}
	}

	openReportDownloadModal() {
			this.updateFilterAnimals();
			this.animalReportDownloaderService.animals = this.filteredAnimals;
			this.animalReportDownloaderService.openModal();
	}
}