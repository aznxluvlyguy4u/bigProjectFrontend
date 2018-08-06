import { Injectable } from '@angular/core';
import { Animal } from '../../../global/components/livestock/livestock.model';
import { Subject } from 'rxjs/Subject';

/**
 * This is not used as a global service
 */
@Injectable()
export class AnimalEditService {
	public genderEditModalStatus = 'none';
	public createNewModalStatus = 'none';
	public foundAnimal: Animal;

	genderEditModalButtonClicked = new Subject<boolean>();

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

}