import { Component, Input, OnInit } from '@angular/core';
import { AnimalResidenceHistory } from '../../../../../global/models/animal-residence-history.model';
import { AnimalEditService } from '../../animal-edit.service';
import { DatepickerV2Component } from '../../../../../global/components/datepickerV2/datepicker-v2.component';
import { CheckMarkComponent } from '../../../../../global/components/checkmark/check-mark.component';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { UbnDropdownComponent } from '../../../../../global/components/ubndropdown/ubn-dropdown.component';
import { SpinnerComponent } from '../../../../../global/components/spinner/spinner.component';
import { TranslatePipe } from 'ng2-translate';
import { SettingsService } from '../../../../../global/services/settings/settings.service';
import { NSFOService } from '../../../../../global/services/nsfo/nsfo.service';
import { Country } from '../../../../../global/models/country.model';

import _ = require('lodash');
import { BooleanInputComponent } from '../../../../../global/components/booleaninput/boolean-input.component';
import { Location } from '../../../../client/client.model';

@Component({
	selector: '[app-animal-residence-history-row]',
	directives: [REACTIVE_FORM_DIRECTIVES, DatepickerV2Component, BooleanInputComponent,
		UbnDropdownComponent, CheckMarkComponent, SpinnerComponent],
	template: require('./animal-residence-history-row.component.html'),
	pipes: [TranslatePipe]
})
export class AnimalResidenceHistoryRowComponent implements OnInit {
	@Input() residence: AnimalResidenceHistory;
	@Input() isForm = false;
	@Input() isCreate = false;

	public isSaving = false;
	public displayLocationEditModal = 'none';
	private tempResidence: AnimalResidenceHistory;
	public modalSelectedLocation: Location;

	public displayRemoveConfirmationModal = 'none';

	constructor(public animalEditService: AnimalEditService, public settings: SettingsService,
							private nsfo: NSFOService) {}

  ngOnInit() {
		if (this.isCreate && this.isForm) {
			this.createDefaultResidence();
		}

		this.afterApplyCheck();
	}

	public startEdit() {
		this.tempResidence = _.cloneDeep(this.residence);
		this.isForm = true;
		this.isCreate = false;
		this.animalEditService.isEditingResidences = true;
	}

	public remove() {
		this.isForm = true;
		this.isCreate = true;
		this.closeRemoveConfirmationModal();
		this.animalEditService.doDeleteAnimalResidence(this.residence);
	}

	public applyChanges() {
		this.isSaving = true;
		if (this.isCreate) {
			this.animalEditService.doCreateAnimalResidence([this.tempResidence]);
		} else {
			this.mergeChangesInOriginalResidence();
			this.animalEditService.doEditAnimalResidence(this.residence);
		}
	}

	public afterApplyCheck() {
		this.animalEditService.isEditSuccessFul.subscribe(
			(isEditSuccessFul: boolean) => {
				if (isEditSuccessFul) {
					this.isForm = false;
					this.isCreate = false;
					this.animalEditService.newResidence = undefined;
					this.animalEditService.isEditingResidences = false;
				}
				this.isSaving = false;
			}
		);
	}

	public cancelChanges() {
		this.tempResidence = undefined;
		this.isForm = false;
		this.isCreate = false;
		this.animalEditService.newResidence = undefined;
		this.animalEditService.isEditingResidences = false;
	}

	public tempUbnDisplayValue(): string {
		return this.tempResidence && this.tempResidence.location && this.tempResidence.location.ubn
			? this.tempResidence.location.ubn : '-';
	}

	public areDeleteResidenceOptionsActive(): boolean {
		return this.animalEditService.areDeleteResidenceOptionsActive;
	}

	public getCountryCodeList(): Country[] {
		return this.nsfo.countryCodeList;
	}

	public closeLocationEditModal() {
		this.displayLocationEditModal = 'none';
	}

	public openLocationEditModal() {
		this.displayLocationEditModal = 'block';
	}

	public cancelRemove() {
		this.closeRemoveConfirmationModal();
	}

	private closeRemoveConfirmationModal() {
		this.displayRemoveConfirmationModal = 'none';
	}

	public openRemoveConfirmationModal() {
		this.displayRemoveConfirmationModal = 'block';
	}

	private mergeChangesInOriginalResidence() {
		this.residence.start_date = this.tempResidence.start_date;
		this.residence.end_date = this.tempResidence.end_date;
		this.residence.location = this.tempResidence.location;
		this.residence.is_pending = this.tempResidence.is_pending;
		this.residence.country = this.tempResidence.country;
	}

	private createDefaultResidence(): void {
		this.tempResidence = new AnimalResidenceHistory();
		this.tempResidence.country = 'NL';
		this.tempResidence.is_pending = false;
		this.tempResidence.animal = this.animalEditService.foundAnimal;
	}

	isEditValidationActive(): boolean {
		return (this.residence.id || this.tempResidence) && !this.isSaving && this.isForm && !this.areDeleteResidenceOptionsActive();
	}

	areEditOptionsActive(): boolean {
		return this.residence.id && !this.isSaving && !this.isForm && !this.areDeleteResidenceOptionsActive();
	}

	isEditOptionsSpinning(): boolean {
		return this.residence.id && this.isSaving && !this.areDeleteResidenceOptionsActive();
	}

	isDeleteOptionActive(): boolean {
		return this.residence.id && !this.isSaving && !this.isForm && this.areDeleteResidenceOptionsActive() && !this.animalEditService.isDeleting;
	}

	isDeleteOptionInactive(): boolean {
		return (this.residence.id && !this.isSaving && !this.isForm && !this.areDeleteResidenceOptionsActive()) || this.animalEditService.isDeleting;
	}

	isDeleteOptionSpinning(): boolean {
		return this.residence.id && this.isSaving && this.areDeleteResidenceOptionsActive();
	}
}