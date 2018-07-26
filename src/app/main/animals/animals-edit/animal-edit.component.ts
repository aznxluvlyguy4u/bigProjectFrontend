import {FormBuilder, FormControl, FormGroup, REACTIVE_FORM_DIRECTIVES, Validators} from '@angular/forms';
import { TranslatePipe, TranslateService } from 'ng2-translate';
import { Component, EventEmitter, OnDestroy, OnInit, Output, Output } from '@angular/core';

import { PaginatePipe, PaginationService } from 'ng2-pagination';
import {DatepickerV2Component} from "../../../global/components/datepickerV2/datepicker-v2.component";
import {SettingsService} from "../../../global/services/settings/settings.service";
import {BREED_TYPES} from "../../../global/constants/breed-type.constant";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {Animal} from "../../../global/components/livestock/livestock.model";
import { UlnInputComponent } from '../../../global/components/ulninput/uln-input.component';
import { Location } from '../../client/client.model';
import { UbnDropdownComponent } from '../../../global/components/ubndropdown/ubn-dropdown.component';
import { PedigreeRegisterDropdownComponent } from '../../../global/components/pedigreeregisterdropdown/pedigree-register-dropdown.component';
import { LocationStorage } from '../../../global/services/storage/LocationStorage';
import { PedigreeRegisterStorage } from '../../../global/services/storage/pedigree-register.storage';
import { ParentSelectorComponent } from '../../../global/components/parentselector/parent-selector.component';
import { ParentsStorage } from '../../../global/services/storage/parents.storage';
import { StnInputComponent } from '../../../global/components/stninput/stn-input.component';
import { SCRAPIE_GENOTYPES } from '../../../global/constants/scrapiegenotype.constant';

@Component({
		providers: [PaginationService],
		directives: [REACTIVE_FORM_DIRECTIVES, DatepickerV2Component, UlnInputComponent,
			UbnDropdownComponent, PedigreeRegisterDropdownComponent, ParentSelectorComponent,
			StnInputComponent],
		template: require('./animal-edit.component.html'),
		pipes: [TranslatePipe, PaginatePipe]
})
export class AnimalEditComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public findForm: FormGroup;
    public editForm: FormGroup;

    public editAnimal: Animal;
    public isCreating: boolean = false;
    public isSearching: boolean = false;
    public defaultIsAliveValue = true;
    public newAnimal: Animal;
    public mandatoryValueIsMissing: boolean;

		public breedTypes: string[] = BREED_TYPES;
		public scrapieGenotypes: string[] = SCRAPIE_GENOTYPES;

    @Output() clearNewAnimalEvent = new EventEmitter<boolean>();

    constructor(
    		private fb: FormBuilder,
				private settings: SettingsService,
        private nsfo: NSFOService,
				private translate: TranslateService,
				private locationStorage: LocationStorage,
				private pedigreeRegisterStorage: PedigreeRegisterStorage,
				private parentStorage: ParentsStorage
	) {}

	ngOnInit() {
    this.initializeCreateForm();
		this.resetCreateForm();
		this.getGeneralData();

		this.findForm = this.fb.group({
			uln: ['', Validators.required],
		});

		this.editForm = this.fb.group({
			gender: ['', Validators.required],
		});
	}

	ngOnDestroy() {
		this.parentStorage.clear();
	}

	getGeneralData() {
		this.locationStorage.refreshLocations();
		this.pedigreeRegisterStorage.initialize();
	}

	initializeCreateForm(): void {
		this.form = this.fb.group({
			gender: ['', Validators.required],
			is_alive: [this.defaultIsAliveValue, Validators.required],
			breed_code: [''],
			breed_type: [''],
			ubn_of_birth: [''],
			scrapie_genotype: [''],
			nickname: [''],
			n_ling_backup: [''],
		});
	}

	public createAnimal(): void {
    		this.mandatoryValueIsMissing = false;

				let errorMessage = this.translate.instant('THESE FORM FIELDS MUST BE FILLED') + ": ";

				const missingSetValues: {isVariableMissing: boolean, label: string}[] = [
					{
						isVariableMissing: !this.newAnimal.uln_country_code,
						label: 'ULN COUNTRY CODE',
					},
					{
						isVariableMissing: !this.newAnimal.uln_number,
						label: 'ULN NUMBER',
					},
					{
						isVariableMissing: !this.newAnimal.date_of_birth,
						label: 'DATE OF BIRTH',
					},
					{
						isVariableMissing: !this.form.controls['gender'].value,
						label: 'GENDER',
					},
					{
						isVariableMissing: !(typeof this.form.controls['is_alive'].value === 'boolean'),
						label: 'ALIVE',
					},
				];

				let prefix = '';
				for (let missingSet of missingSetValues) {
					if(missingSet.isVariableMissing) {
						errorMessage += prefix + this.translate.instant(missingSet.label) ;
						prefix = ', ';
						this.mandatoryValueIsMissing = true;
					}
				}

        if(this.form.valid && !this.mandatoryValueIsMissing) {
            this.isCreating = true;

            this.newAnimal.gender = this.form.controls['gender'].value;
            this.newAnimal.is_alive = this.form.controls['is_alive'].value;
            this.newAnimal.breed_code = this.form.controls['breed_code'].value;
            this.newAnimal.breed_type = this.form.controls['breed_type'].value;
            this.newAnimal.ubn_of_birth = this.form.controls['ubn_of_birth'].value;
            this.newAnimal.scrapie_genotype = this.form.controls['scrapie_genotype'].value;
            this.newAnimal.nickname = this.form.controls['nickname'].value;
            this.newAnimal.n_ling = this.form.controls['n_ling_backup'].value;
            this.newAnimal.uln = this.newAnimal.uln_country_code + this.newAnimal.uln_number;

            this.nsfo.doPostRequest(this.nsfo.URI_ANIMALS_CREATE, this.newAnimal)
							.finally(()=>{
								this.isCreating = false;
							})
                .subscribe(
                    res => {
                        alert(res.result);
                        this.resetCreateForm();
                    }, error => {
                        alert(this.nsfo.getErrorMessage(error));
                    }
                );
				} else {
        	alert(errorMessage);
				}
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
                        this.setEditAnimal(res.result);
                        this.resetFindForm();
                    }, error => {
                        alert(this.nsfo.getErrorMessage(error));
                    }
                );
        }
    }

    private setEditAnimal(animal: Animal) {
			this.editAnimal = animal;
			(<FormControl>this.editForm.controls['gender']).updateValue(this.editAnimal.type.toUpperCase());
    }

    public updateAnimal(): void {
        if(this.editForm.valid && !!this.editAnimal) {
            const body = {
                uln_number: this.editAnimal.uln_number,
                uln_country_code: this.editAnimal.uln_country_code,
                gender: this.editForm.controls['gender'].value,
            };
					  this.isSearching = true;
            this.nsfo.doPostRequest(this.nsfo.URI_ANIMALS_UPDATE_GENDER, body)
							.finally(()=>{
								this.isSearching = false;
							})
                .subscribe(
                    res => {
											this.setEditAnimal(res);
                        }, error => {
                        alert(this.nsfo.getErrorMessage(error));
                    }
                );
        }
    }

    private resetCreateForm() {
				this.clearNewAnimalEvent.emit(true);
				this.newAnimal = new Animal();

        (<FormControl>this.form.controls['gender']).updateValue('');
        (<FormControl>this.form.controls['is_alive']).updateValue(this.defaultIsAliveValue);
        (<FormControl>this.form.controls['breed_code']).updateValue('');
        (<FormControl>this.form.controls['breed_type']).updateValue('');
        (<FormControl>this.form.controls['ubn_of_birth']).updateValue('');
        (<FormControl>this.form.controls['scrapie_genotype']).updateValue('');
        (<FormControl>this.form.controls['nickname']).updateValue('');
        (<FormControl>this.form.controls['n_ling_backup']).updateValue('');
    }

    private resetFindForm() {
        (<FormControl>this.findForm.controls['uln']).updateValue('');
    }

    public setLocationOfBirth(location?: Location): void {
				this.newAnimal.location_of_birth = location;
    		if (!!location) {
    				this.newAnimal.ubn_of_birth = location.ubn;
				}
		}
}