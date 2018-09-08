import { Injectable } from '@angular/core';
import { Animal } from '../../../global/components/livestock/livestock.model';
import { Subject } from 'rxjs/Subject';
import { NSFOService } from '../../../global/services/nsfo/nsfo.service';
import { AnimalResidenceHistory } from '../../../global/models/animal-residence-history.model';

/**
 * This is not used as a global service
 */
@Injectable()
export class AnimalEditService {
	public genderEditModalStatus = 'none';
	public createNewModalStatus = 'none';
	public foundAnimal: Animal;

	public isSearchingResidences = false;
	public isEditingResidences = false;
	public isDeleting = false;
	public areDeleteResidenceOptionsActive = false;
	public newResidence: AnimalResidenceHistory;

	genderEditModalButtonClicked = new Subject<boolean>();
	isEditSuccessFul = new Subject<boolean>();

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

	toggleDeleteMode(): void {
		this.areDeleteResidenceOptionsActive = !this.areDeleteResidenceOptionsActive;
		// if (this.isDeleting) {
		//
		// 	this.isDeleting = false;
		// } else {
		// 	this.animalEditService.areDeleteResidenceOptionsActive = true;
		// 	this.isDeleting = true;
		// }
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

	public startCreateNewResidence() {
		this.newResidence = new AnimalResidenceHistory();
		this.areDeleteResidenceOptionsActive = false;
		this.isEditingResidences = true;
	}

	public doDeleteAnimalResidence(animalResidence: AnimalResidenceHistory) {
		if (!this.isDeleting) {
			this.isDeleting = true;
			this.nsfo.doDeleteRequest(this.nsfo.URI_ANIMAL_RESIDENCES + '/' + animalResidence.id, {})
				.finally(()=>{
					this.isDeleting = false;
				})
				.subscribe(
					res => {
						this.foundAnimal.animal_residence_history = res.result;
						this.isEditSuccessFul.next(true);
					}, error => {
						alert(this.nsfo.getErrorMessage(error));
						this.isEditSuccessFul.next(false);
					}
				);
		}
	}

	public doEditAnimalResidence(animalResidence: AnimalResidenceHistory) {
		this.nsfo.doPutRequest(this.nsfo.URI_ANIMAL_RESIDENCES + '/' + animalResidence.id, animalResidence)
			.finally(()=>{
			})
			.subscribe(
				res => {
					this.foundAnimal.animal_residence_history = res.result;
					this.isEditSuccessFul.next(true);
				}, error => {
					alert(this.nsfo.getErrorMessage(error));
					this.isEditSuccessFul.next(false);
				}
			);
	}

	public doCreateAnimalResidence(animalResidences: AnimalResidenceHistory[]) {
		this.nsfo.doPostRequest(this.nsfo.URI_ANIMAL_RESIDENCES, animalResidences)
			.finally(()=>{
			})
			.subscribe(
				res => {
					this.foundAnimal.animal_residence_history = res.result;
					this.isEditSuccessFul.next(true);
				}, error => {
					alert(this.nsfo.getErrorMessage(error));
					this.isEditSuccessFul.next(false);
				}
			);
	}

}