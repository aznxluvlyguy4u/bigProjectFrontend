import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { FormBuilder, FormControl, FormGroup, REACTIVE_FORM_DIRECTIVES, Validators } from '@angular/forms';
import { Animal } from '../../../../global/components/livestock/livestock.model';
import { NSFOService } from '../../../../global/services/nsfo/nsfo.service';
import { AnimalEditService } from '../animal-edit.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-edit-gender-modal',
	directives: [REACTIVE_FORM_DIRECTIVES],
	template: require('./edit-gender-modal.component.html'),
	pipes: [TranslatePipe]
})
export class EditGenderModalComponent implements OnInit, OnDestroy {
	public editForm: FormGroup;
	public editAnimal: Animal;
	isUpdating = false;

	private onDestroy$: Subject<void> = new Subject<void>();

	constructor(private nsfo: NSFOService, private fb: FormBuilder,
							private animalEditService: AnimalEditService) {
	}

	ngOnInit() {
		this.editForm = this.fb.group({
			gender: ['', Validators.required],
		});

		this.animalEditService.genderEditModalButtonClicked
			.pipe(takeUntil(this.onDestroy$))
			.subscribe(
			(isModalOpened: boolean) => {
				if (isModalOpened) {
					this.setAnimal();
				}
			}
		);
	}

	ngOnDestroy() {
		this.onDestroy$.next();
	}

	private setAnimal() {
		this.editAnimal = this.animalEditService.foundAnimal;
		(<FormControl>this.editForm.controls['gender']).updateValue(this.editAnimal.type.toUpperCase());
	}

	public updateAnimal(): void {
		if(this.editForm.valid && !!this.editAnimal) {
			const newGender = this.editForm.controls['gender'].value;
			const body = {
				uln_number: this.editAnimal.uln_number,
				uln_country_code: this.editAnimal.uln_country_code,
				gender: newGender,
			};
			this.isUpdating = true;
			this.nsfo.doPostRequest(this.nsfo.URI_ANIMALS_UPDATE_GENDER, body)
				.finally(()=>{
					this.isUpdating = false;
				})
				.pipe(takeUntil(this.onDestroy$))
				.subscribe(
					(res: Animal) => {
						this.editAnimal.gender = res.gender;
						this.editAnimal.type = res.type;
						this.animalEditService.foundAnimal = this.editAnimal;
						this.animalEditService.closeGenderEditModal();
					}, error => {
						alert(this.nsfo.getErrorMessage(error));
					}
				);
		}
	}

	displayModal(): boolean {
		return this.animalEditService.displayGenderEditModal();
	}

	closeModal() {
		this.animalEditService.closeGenderEditModal();
	}
}