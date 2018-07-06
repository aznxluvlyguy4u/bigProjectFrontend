import {FormBuilder, FormControl, FormGroup, REACTIVE_FORM_DIRECTIVES, Validators} from '@angular/forms';
import { TranslatePipe, TranslateService } from 'ng2-translate';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';

import { PaginatePipe, PaginationService } from 'ng2-pagination';
import {DatepickerV2Component} from "../../../global/components/datepickerV2/datepicker-v2.component";
import {SettingsService} from "../../../global/services/settings/settings.service";
import {BREED_TYPES} from "../../../global/constants/breed-type.constant";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {Animal} from "../../../global/components/livestock/livestock.model";

@Component({
		providers: [PaginationService],
		directives: [REACTIVE_FORM_DIRECTIVES, DatepickerV2Component],
		template: require('./animal-edit.component.html'),
		pipes: [TranslatePipe, PaginatePipe]
})
export class AnimalEditComponent implements OnInit {
    public form: FormGroup;
    public findForm: FormGroup;
    public editForm: FormGroup;
    public dateOfBirth: any;
    public breedTypes: string[] = BREED_TYPES;
    public editAnimal: Animal;
    public isCreating: boolean = false;
    public isSearching: boolean = false;

    constructor(
    	private fb: FormBuilder,
		private settings: SettingsService,
        private nsfo: NSFOService
	) {
        this.form = fb.group({
            uln: ['', Validators.required],
            gender: ['', Validators.required],
            is_alive: ['', Validators.required],
            breed_code: ['', Validators.required],
            breed_type: ['', Validators.required],
        });

        this.findForm = fb.group({
            uln: ['', Validators.required],
        });

        this.editForm = fb.group({
            gender: ['', Validators.required],
        });

	}

	ngOnInit() {

	}

	public createAnimal(): void {
        if(this.form.valid) {
            this.isCreating = true;
            const createBody = {
                uln: this.form.controls['uln'].value,
                date_of_birth: this.dateOfBirth,
                gender: this.form.controls['gender'].value,
                is_alive: this.form.controls['is_alive'].value,
                breed_code: this.form.controls['breed_code'].value,
                breed_type: this.form.controls['breed_type'].value
            };
            this.nsfo.doPostRequest(this.nsfo.URI_ANIMALS_CREATE, createBody)
                .subscribe(
                    res => {
                        alert(res.result);
                        this.resetCreateForm();
                    }, error => {
                        alert(this.nsfo.getErrorMessage(error));
                    }, () => {
                        this.isCreating = false;
                    }
                );
		}
	}

	public findAnimal(): void {
        if(this.findForm.valid) {
            const body = {
                uln: this.findForm.controls['uln'].value,
            };
            this.isSearching = true;
            this.nsfo.doPostRequest(this.nsfo.URI_ANIMALS_FIND, body)
                .subscribe(
                    res => {
                        this.editAnimal = res.result;
                        (<FormControl>this.editForm.controls['gender']).updateValue(this.editAnimal.gender);
                        this.resetFindForm();
                    }, error => {
                        alert(this.nsfo.getErrorMessage(error));
                    }, () => {
                        this.isSearching = false;
                    }
                );
        }
    }

    public updateAnimal(): void {
        if(this.editForm.valid && !!this.editAnimal) {
            const body = {
                uln_number: this.editAnimal.uln_number,
                uln_country_code: this.editAnimal.uln_country_code,
                gender: this.editForm.controls['gender'].value,
            };
            this.nsfo.doPostRequest(this.nsfo.URI_ANIMALS_UPDATE_GENDER, body)
                .subscribe(
                    res => {
                        alert(res.result);
                    }, error => {
                        alert(this.nsfo.getErrorMessage(error));
                    }
                );
        }
    }

    private resetCreateForm() {
        (<FormControl>this.form.controls['uln']).updateValue('');
        (<FormControl>this.form.controls['gender']).updateValue('');
        (<FormControl>this.form.controls['is_alive']).updateValue('');
        (<FormControl>this.form.controls['breed_code']).updateValue('');
        (<FormControl>this.form.controls['breed_type']).updateValue('');
    }

    private resetFindForm() {
        (<FormControl>this.findForm.controls['uln']).updateValue('');
    }
}