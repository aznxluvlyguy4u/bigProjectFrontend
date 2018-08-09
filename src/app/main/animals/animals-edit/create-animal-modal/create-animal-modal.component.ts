import { PedigreeRegisterDropdownComponent } from '../../../../global/components/pedigreeregisterdropdown/pedigree-register-dropdown.component';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StnInputComponent } from '../../../../global/components/stninput/stn-input.component';
import { DatepickerV2Component } from '../../../../global/components/datepickerV2/datepicker-v2.component';
import { UbnDropdownComponent } from '../../../../global/components/ubndropdown/ubn-dropdown.component';
import { UlnInputComponent } from '../../../../global/components/ulninput/uln-input.component';
import { ParentSelectorComponent } from '../../../../global/components/parentselector/parent-selector.component';
import { TranslatePipe, TranslateService } from 'ng2-translate';
import { SettingsService } from '../../../../global/services/settings/settings.service';
import { NSFOService } from '../../../../global/services/nsfo/nsfo.service';
import { FormBuilder, FormControl, FormGroup, REACTIVE_FORM_DIRECTIVES, Validators } from '@angular/forms';
import { SCRAPIE_GENOTYPES } from '../../../../global/constants/scrapiegenotype.constant';
import { BREED_TYPES } from '../../../../global/constants/breed-type.constant';
import { Animal } from '../../../../global/components/livestock/livestock.model';
import { Location } from '../../../client/client.model';
import { AnimalEditService } from '../animal-edit.service';
import { AnimalResidenceHistory } from '../../../../global/models/animal-residence-history.model';
import { UtilsService } from '../../../../global/services/utils/utils.service';

@Component({
	selector: 'app-create-animal-modal',
	directives: [REACTIVE_FORM_DIRECTIVES, DatepickerV2Component, UlnInputComponent,
		UbnDropdownComponent, PedigreeRegisterDropdownComponent, ParentSelectorComponent,
		StnInputComponent],
	template: require('./create-animal-modal.component.html'),
	pipes: [TranslatePipe]
})
export class CreateAnimalModalComponent implements OnInit {
	public form: FormGroup;
	public isCreating: boolean = false;

	public defaultIsAliveValue = true;
	public newAnimal: Animal;
	public currentUbnStartDate: string;
	public mandatoryValueIsMissing: boolean;

	public breedTypes: string[] = BREED_TYPES;
	public scrapieGenotypes: string[] = SCRAPIE_GENOTYPES;

	@Output() clearNewAnimalEvent = new EventEmitter<boolean>();
	@Output() closeModalEvent = new EventEmitter<boolean>();



	constructor(
		private fb: FormBuilder,
		private settings: SettingsService,
		private nsfo: NSFOService,
		private translate: TranslateService,
		public animalEditService: AnimalEditService
	) {}

	ngOnInit() {
		this.initializeCreateForm();
		this.resetCreateForm();
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

	resetCreateForm() {
		this.clearNewAnimalEvent.emit(true);
		this.newAnimal = new Animal();
		this.currentUbnStartDate = undefined;

		(<FormControl>this.form.controls['gender']).updateValue('');
		(<FormControl>this.form.controls['is_alive']).updateValue(this.defaultIsAliveValue);
		(<FormControl>this.form.controls['breed_code']).updateValue('');
		(<FormControl>this.form.controls['breed_type']).updateValue('');
		(<FormControl>this.form.controls['ubn_of_birth']).updateValue('');
		(<FormControl>this.form.controls['scrapie_genotype']).updateValue('');
		(<FormControl>this.form.controls['nickname']).updateValue('');
		(<FormControl>this.form.controls['n_ling_backup']).updateValue('');
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

			this.newAnimal.type = UtilsService.getAnimalTypeFromGender(this.newAnimal.gender);

			if (!!this.newAnimal.location && !!this.currentUbnStartDate) {
				const startResidence: AnimalResidenceHistory = {
					start_date: this.currentUbnStartDate,
					location: this.newAnimal.location
				};

				this.newAnimal.animal_residence_history = [startResidence];
			}

			this.nsfo.doPostRequest(this.nsfo.URI_ANIMALS_CREATE, this.newAnimal)
				.finally(()=>{
					this.isCreating = false;
				})
				.subscribe(
					res => {
						this.animalEditService.foundAnimal = res.result;
						this.resetCreateForm();
					}, error => {
						alert(this.nsfo.getErrorMessage(error));

						// A SIMPLE "FIX" to make sure the view and data is consistent
						this.newAnimal.location = undefined;
						this.newAnimal.location_of_birth = undefined;
						this.newAnimal.animal_residence_history = [];
					}
				);
		} else {
			alert(errorMessage);
		}
	}

	public setLocationOfBirth(location?: Location): void {
		this.newAnimal.location_of_birth = location;
		if (!!location) {
			this.newAnimal.ubn_of_birth = location.ubn;
		}
	}

	displayModal(): boolean {
		return this.animalEditService.createNewModalStatus === 'block';
	}

	closeModal() {
		this.animalEditService.closeCreateNewModal();
		this.resetCreateForm();
	}

}