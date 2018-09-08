import { NSFOService } from '../../../../global/services/nsfo/nsfo.service';
import { TranslatePipe } from 'ng2-translate';
import { AnimalEditService } from '../animal-edit.service';
import { Component } from '@angular/core';
import { Animal } from '../../../../global/components/livestock/livestock.model';
import { PaginatePipe, PaginationService } from 'ng2-pagination';
import { PaginationComponent } from '../../../../global/components/pagination/pagination.component';
import { AnimalResidenceSortPipe } from '../../../../global/pipes/animal-residence-sort.pipe';
import { AnimalResidenceHistoryRowComponent } from './animal-residence-history-row/animal-residence-history-row.component';

@Component({
	selector: "app-animal-residence-history",
	directives: [PaginationComponent, AnimalResidenceHistoryRowComponent],
	template: require('./animal-residence-history.component.html'),
	providers: [PaginationService],
	pipes: [TranslatePipe, AnimalResidenceSortPipe, PaginatePipe]
})
export class AnimalResidenceHistoryComponent {
	public filterResidenceAmount = 10;
	public residencePage = 1;
	public sortResidencesAscending = false;

	constructor(
		private nsfo: NSFOService,
		private animalEditService: AnimalEditService
	) {}

	getAnimal(): Animal {
		return this.animalEditService.foundAnimal;
	}

	getIsSearchingResidences(): boolean {
		return this.animalEditService.isSearchingResidences;
	}

	public startCreateNewResidence() {
		this.animalEditService.startCreateNewResidence();
	}

	public refreshAnimalResidences() {
		this.animalEditService.doGetAnimalResidences();
	}

	public areDeleteResidenceOptionsActive(): boolean {
		return this.animalEditService.areDeleteResidenceOptionsActive;
	}
}