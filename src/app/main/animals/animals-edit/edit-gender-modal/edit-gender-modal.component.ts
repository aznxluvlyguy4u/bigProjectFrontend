import { Component, Input, OnInit } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { FormControl, FormGroup, REACTIVE_FORM_DIRECTIVES, Validators } from '@angular/forms';
import { Animal } from '../../../../global/components/livestock/livestock.model';
import { NSFOService } from '../../../../global/services/nsfo/nsfo.service';

@Component({
	selector: 'app-edit-gender-modal',
	directives: [REACTIVE_FORM_DIRECTIVES],
	template: require('./edit-gender-modal.component.html'),
	pipes: [TranslatePipe]
})
export class EditGenderModalComponent implements OnInit {
	public editForm: FormGroup;
	public editAnimal: Animal;

	constructor(private nsfo: NSFOService) {
	}

	ngOnInit() {
		this.editForm = this.fb.group({
			gender: ['', Validators.required],
		});
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
						this.setAnimal(res);
					}, error => {
						alert(this.nsfo.getErrorMessage(error));
					}
				);
		}
	}

	@Input()
	public setAnimal(animal: Animal) {
		this.editAnimal = animal;
		(<FormControl>this.editForm.controls['gender']).updateValue(this.editAnimal.type.toUpperCase());
	}
}