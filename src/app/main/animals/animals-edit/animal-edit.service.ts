import { Injectable } from '@angular/core';
import { Animal } from '../../../global/components/livestock/livestock.model';
import { Subject } from 'rxjs/Subject';
import { NSFOService } from '../../../global/services/nsfo/nsfo.service';

/**
 * This is not used as a global service
 */
@Injectable()
export class AnimalEditService {
	public genderEditModalStatus = 'none';
	public createNewModalStatus = 'none';
	public foundAnimal: Animal;

	public isSearchingResidences = false;

	genderEditModalButtonClicked = new Subject<boolean>();

	constructor(private nsfo: NSFOService) {}

	openGenderEditModal(): void {
		this.genderEditModalStatus = 'block';
		this.genderEditModalButtonClicked.next(true);
	}

	closeGenderEditModal(): void {
		this.genderEditModalStatus = 'none'
	}

	displayGenderEditModal(): boolean {
		return this.genderEditModalStatus === 'block';
	}

	toggleGenderEditModal(): void {
		if (this.genderEditModalStatus === 'none') {
			this.openGenderEditModal();
		} else {
			this.closeGenderEditModal();
		}
	}


	openCreateNewModal(): void {
		this.createNewModalStatus = 'block';
	}

	closeCreateNewModal(): void {
		this.createNewModalStatus = 'none';
	}

	toggleCreateNewModal(): void {
		if (this.genderEditModalStatus === 'none') {
			this.openCreateNewModal();
		} else {
			this.closeCreateNewModal();
		}
	}


	public doGetAnimalResidences(): void {
		this.isSearchingResidences = true;
		this.nsfo.doGetRequest(this.nsfo.URI_ANIMAL_RESIDENCES + '/animal/' + this.foundAnimal.id)
			.finally(()=>{
				this.isSearchingResidences = false;
			})
			.subscribe(
				res => {
					this.foundAnimal.animal_residence_history = res.result;
				}, error => {
					alert(this.nsfo.getErrorMessage(error));
				}
			);
	}
}