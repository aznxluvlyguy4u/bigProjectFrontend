import {FormBuilder, FormControl, FormGroup, REACTIVE_FORM_DIRECTIVES, Validators} from '@angular/forms';
import { TranslatePipe, TranslateService } from 'ng2-translate';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import {DatepickerV2Component} from "../../../global/components/datepickerV2/datepicker-v2.component";
import {SettingsService} from "../../../global/services/settings/settings.service";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {Animal} from "../../../global/components/livestock/livestock.model";
import { UlnInputComponent } from '../../../global/components/ulninput/uln-input.component';
import { UbnDropdownComponent } from '../../../global/components/ubndropdown/ubn-dropdown.component';
import { PedigreeRegisterDropdownComponent } from '../../../global/components/pedigreeregisterdropdown/pedigree-register-dropdown.component';
import { LocationStorage } from '../../../global/services/storage/LocationStorage';
import { PedigreeRegisterStorage } from '../../../global/services/storage/pedigree-register.storage';
import { ParentSelectorComponent } from '../../../global/components/parentselector/parent-selector.component';
import { ParentsStorage } from '../../../global/services/storage/parents.storage';
import { StnInputComponent } from '../../../global/components/stninput/stn-input.component';
import { CreateAnimalModalComponent } from './create-animal-modal/create-animal-modal.component';
import { EditGenderModalComponent } from './edit-gender-modal/edit-gender-modal.component';
import { AnimalEditService } from './animal-edit.service';
import { AnimalResidenceSortPipe } from '../../../global/pipes/animal-residence-sort.pipe';
import { PaginatePipe, PaginationService } from 'ng2-pagination';
import { PaginationComponent } from '../../../global/components/pagination/pagination.component';
import { CheckMarkComponent } from '../../../global/components/checkmark/check-mark.component';
import { SpinnerComponent } from '../../../global/components/spinner/spinner.component';
import { AnimalResidenceHistory } from '../../../global/models/animal-residence-history.model';

@Component({
		directives: [REACTIVE_FORM_DIRECTIVES, DatepickerV2Component, UlnInputComponent,
			UbnDropdownComponent, PedigreeRegisterDropdownComponent, ParentSelectorComponent,
			StnInputComponent, CreateAnimalModalComponent, EditGenderModalComponent, PaginationComponent,
			CheckMarkComponent, SpinnerComponent],
		template: require('./animal-edit.component.html'),
		providers: [AnimalEditService, PaginationService],
		pipes: [TranslatePipe, AnimalResidenceSortPipe, PaginatePipe]
})
export class AnimalEditComponent implements OnInit, OnDestroy {
    public findForm: FormGroup;

    public isSearching: boolean = false;
    public isSearchingResidences: boolean = false;
    public isEditingResidence: boolean = false;

    public filterResidenceAmount = 10;
    public residencePage = 1;
    public sortResidencesAscending = false;

    @Input()
    public displayNewAnimalModal = 'none';
		@Input()
    public openGenderEdit: boolean;

    constructor(
    		private fb: FormBuilder,
				private settings: SettingsService,
        private nsfo: NSFOService,
				private translate: TranslateService,
				private locationStorage: LocationStorage,
				private pedigreeRegisterStorage: PedigreeRegisterStorage,
				private parentStorage: ParentsStorage,
				private animalEditService: AnimalEditService
	) {}

	ngOnInit() {
		this.getGeneralData();

		this.findForm = this.fb.group({
			uln: ['', Validators.required],
		});
	}

	ngOnDestroy() {
		this.parentStorage.clear();
	}

	getGeneralData() {
		this.locationStorage.refreshLocations();
		this.pedigreeRegisterStorage.initialize();
	}

	public findAnimal(): void {
        if(this.findForm.valid) {
            const body = {
                uln: this.findForm.controls['uln'].value,
            };
            this.isSearching = true;
            this.nsfo.doPostRequest(this.nsfo.URI_ANIMALS_FIND, body)
              .finally(()=>{
								this.isSearching = false;
              })
                .subscribe(
                    res => {
                        this.animalEditService.foundAnimal = res.result;
                        this.resetFindForm();
                        this.getAnimalResidences();
                    }, error => {
                        alert(this.nsfo.getErrorMessage(error));
                    }
                );
        }
    }

    private getAnimalResidences(): void {
    	this.isSearchingResidences = true;
			this.nsfo.doGetRequest(this.nsfo.URI_ANIMAL_RESIDENCES + '/animal/' + this.animalEditService.foundAnimal.id)
				.finally(()=>{
					this.isSearchingResidences = false;
				})
				.subscribe(
					res => {
						this.animalEditService.foundAnimal.animal_residence_history = res.result;
					}, error => {
						alert(this.nsfo.getErrorMessage(error));
					}
				);
		}

    getAnimal(): Animal {
    	return this.animalEditService.foundAnimal;
		}

    private resetFindForm() {
        (<FormControl>this.findForm.controls['uln']).updateValue('');
    }

    public getStnOutput(animal: Animal): string {
    	return !!animal.pedigree_country_code && !!animal.pedigree_number ?
				animal.pedigree_country_code + ' ' + animal.pedigree_number : '-';
		}

		public openGenderEditModal(): void {
    	this.animalEditService.openGenderEditModal();
		}

		public openCreateNewModal(): void {
    	this.animalEditService.openCreateNewModal();
		}

		public openResidenceEditModal(residence: AnimalResidenceHistory) {

		}

		public openResidenceRemoveModal(residence: AnimalResidenceHistory) {

		}

		public startCreateNewResidence() {

		}

		public refreshAnimalResidences() {
    		this.getAnimalResidences();
		}
}