import { Injectable } from '@angular/core';

/**
 * This is not used as a global service
 */
@Injectable()
export class AnimalEditService {
	public genderEditModalStatus = 'none';
	public createNewModalStatus = 'none';

	openGenderEditModal(): void {
		this.genderEditModalStatus = 'block';
	}

	closeGenderEditModal(): void {
		this.genderEditModalStatus = 'none'
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