import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { LedgerCategoryStorage } from '../../services/storage/ledger-category.storage';
import { LedgerCategory } from '../../models/ledger-category.model';
import { PaginationComponent } from '../pagination/pagination.component';
import { PaginatePipe, PaginationService } from 'ng2-pagination';
import { SpinnerComponent } from '../spinner/spinner.component';
import { LedgerCategoryPipe } from '../../pipes/ledger-category.pipe';
import { CheckMarkComponent } from '../checkmark/check-mark.component';

@Component({
	selector: 'app-ledger-category-dropdown',
	template: require('./ledger-category-dropdown.component.html'),
	directives: [SpinnerComponent, PaginationComponent, CheckMarkComponent],
	providers: [PaginationService],
	pipes: [TranslatePipe, PaginatePipe, LedgerCategoryPipe]
})
export class LedgerCategoryDropdownComponent implements OnInit {
	isLoaded: boolean;

	filterSearch: string;
	filterActiveOnly: boolean;
	filterAmount: number;

	displayModal: string;
	initialSelectedLedgerCategory: LedgerCategory;

	@Input() selectedLedgerCategory: LedgerCategory;
	@Input() disabled: boolean = false;
	@Input() activeOnly: boolean = false;
	@Input() displayActiveStatus: boolean = false;
	@Output() selectedLedgerCategoryChanged = new EventEmitter<LedgerCategory>();

	isLoadedEvent = new EventEmitter<boolean>();

	constructor(private ledgerCategoryStorage: LedgerCategoryStorage) {}

	ngOnInit() {
		this.setInitialValues();
		this.initialSelectedLedgerCategory = this.selectedLedgerCategory;

		if (this.isLedgerCategoriesEmpty()) {

			this.ledgerCategoryStorage.ledgerCategoriesChanged.takeLast(1)
				.subscribe(
					res => {
						this.isLoaded = true;
						this.isLoadedEvent.emit(true);
					},
					error => {
						alert('ERROR RELOADING CLIENTS');
					}
				);

			this.ledgerCategoryStorage.refresh();

		} else {

			this.isLoaded = true;
			this.isLoadedEvent.emit(true);
		}
	}

	private setInitialValues() {
		this.displayModal = 'none';
		this.filterSearch = '';
		this.filterActiveOnly = false;
		this.filterAmount = 5;
	}

	getLedgerCategories(): LedgerCategory[] {
		if (this.activeOnly) {
			return this.ledgerCategoryStorage.getLedgerCategoriesActiveOnly();
		}
		return this.ledgerCategoryStorage.ledgerCategories;
	}

	isLedgerCategoriesEmpty(): boolean {
		return this.getLedgerCategories().length === 0;
	}

	selectLedgerCategory(ledgerCategory: LedgerCategory) {
		this.selectedLedgerCategory = ledgerCategory;
		this.clickOK();
	}

	buttonText(): string {
		if (this.selectedLedgerCategory) {
			return this.selectedLedgerCategory.code+': '
				+this.selectedLedgerCategory.description;
		}
		return 'SELECT LEDGER CATEGORY';
	}

	disableEditOrInsertButton(): boolean {
		return this.isLedgerCategoriesEmpty() || this.selectedLedgerCategory == null;
	}

	openModal() {
		this.displayModal = 'block';
	}

	closeModal() {
		this.displayModal = 'none';
		this.setInitialValues();
	}

	clickCancel() {
		this.closeModal();
		this.selectedLedgerCategory = this.initialSelectedLedgerCategory;
	}

	clickOK() {
		this.closeModal();
		this.notifySelectedLedgerCategoryChanged();
		this.initialSelectedLedgerCategory = this.selectedLedgerCategory;
	}

	notifySelectedLedgerCategoryChanged() {
		if (this.selectedLedgerCategory !== this.initialSelectedLedgerCategory) {
			this.selectedLedgerCategoryChanged.emit(this.selectedLedgerCategory);
		}
	}

	getFilterOptions(): any[] {
		return [
			this.filterSearch,
			this.filterActiveOnly,
		];
	}
}