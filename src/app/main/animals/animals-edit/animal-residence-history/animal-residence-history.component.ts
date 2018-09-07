import { FormBuilder, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { NSFOService } from '../../../../global/services/nsfo/nsfo.service';
import { TranslatePipe, TranslateService } from 'ng2-translate';
import { SettingsService } from '../../../../global/services/settings/settings.service';
import { LocationStorage } from '../../../../global/services/storage/LocationStorage';
import { AnimalEditService } from '../animal-edit.service';
import { Component, OnInit } from '@angular/core';
import { AnimalResidenceHistory } from '../../../../global/models/animal-residence-history.model';
import { Animal } from '../../../../global/components/livestock/livestock.model';
import { PaginatePipe, PaginationService } from 'ng2-pagination';
import { CheckMarkComponent } from '../../../../global/components/checkmark/check-mark.component';
import { SpinnerComponent } from '../../../../global/components/spinner/spinner.component';
import { DatepickerV2Component } from '../../../../global/components/datepickerV2/datepicker-v2.component';
import { PaginationComponent } from '../../../../global/components/pagination/pagination.component';
import { AnimalResidenceSortPipe } from '../../../../global/pipes/animal-residence-sort.pipe';
import { UbnDropdownComponent } from '../../../../global/components/ubndropdown/ubn-dropdown.component';

@Component({
	selector: "app-animal-residence-history",
	directives: [REACTIVE_FORM_DIRECTIVES, DatepickerV2Component,
		UbnDropdownComponent, PaginationComponent,
		CheckMarkComponent, SpinnerComponent],
	template: require('./animal-residence-history.component.html'),
	providers: [PaginationService],
	pipes: [TranslatePipe, AnimalResidenceSortPipe, PaginatePipe]
})
export class AnimalResidenceHistoryComponent implements OnInit {
	public isEditingResidence: boolean = false;

	public filterResidenceAmount = 10;
	public residencePage = 1;
	public sortResidencesAscending = false;

	constructor(
		private fb: FormBuilder,
		private settings: SettingsService,
		private nsfo: NSFOService,
		private translate: TranslateService,
		private locationStorage: LocationStorage,
		private animalEditService: AnimalEditService
	) {}

	ngOnInit() {

	}

	getAnimal(): Animal {
		return this.animalEditService.foundAnimal;
	}

	getIsSearchingResidences(): boolean {
		return this.animalEditService.isSearchingResidences;
	}

	public openResidenceEditModal(residence: AnimalResidenceHistory) {

	}

	public openResidenceRemoveModal(residence: AnimalResidenceHistory) {

	}

	public startCreateNewResidence() {

	}

	public refreshAnimalResidences() {
		this.animalEditService.doGetAnimalResidences();
	}
}