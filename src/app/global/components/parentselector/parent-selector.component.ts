import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { TranslatePipe, TranslateService } from 'ng2-translate';
import { FATHER, MOTHER, SURROGATE } from '../../constants/parent-type.constant';
import { UlnInputComponent } from '../ulninput/uln-input.component';
import { Animal } from '../livestock/livestock.model';
import { ParentsStorage } from '../../services/storage/parents.storage';
import { Subject } from 'rxjs/Subject';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
	selector: 'app-parent-selector',
	template: require('./parent-selector.component.html'),
	directives: [UlnInputComponent, SpinnerComponent],
	pipes: [TranslatePipe]
})
export class ParentSelectorComponent implements OnInit {

	@Input() parentType: string;
	@Input() parent: Animal;
	ulnCountryCode: string;
	ulnNumber: string;

	@Input() disabled: boolean;

	@Output() parentChange = new EventEmitter<Animal>();

	displayModal;
	searchUlnCountryCode: string;
	searchUlnNumber: string;

	initialParent: Animal;
	foundParent: Animal;
	isSearchingParent: boolean;
	isParentFound: boolean;


	private getByUlnSubscription: Subject<Animal>;
	private isGetByUlnSubscribed: boolean;

	constructor(private parentStorage: ParentsStorage,
							private translateService: TranslateService
	) {}

	ngOnInit() {
		this.displayModal = 'none';

		this.initialParent = this.parent;
		this.setUlnVarsOfParent();

		this.disabled = false;
		this.isSearchingParent = false;
		this.isParentFound = false;
		this.searchUlnCountryCode = this.ulnCountryCode;
		this.searchUlnNumber = this.ulnNumber;

		this.getByUlnSubscription = this.parentStorage.getByUlnChanged;
		this.isGetByUlnSubscribed = false;
	}

	private setUlnVarsOfParent() {
		this.ulnCountryCode = this.parent ? this.parent.uln_country_code : null;
		this.ulnNumber = this.parent ? this.parent.uln_number : null;
	}

	getParentLabel() {
		switch (this.parentType) {
			case FATHER: return 'FATHER';
			case MOTHER: return 'MOTHER';
			case SURROGATE: return 'SURROGATE MOTHER';
			default: alert('INVALID PARENT TYPE!'); return '';
		}
	}

	getGenderType() {
		switch (this.parentType) {
			case FATHER: return 'Ram';
			case MOTHER: return 'Ewe';
			case SURROGATE: return 'Ewe';
			default: alert('INVALID PARENT TYPE!'); return '';
		}
	}

	searchParent() {
		if (!this.isSearchingParent) {

			if (this.searchUlnCountryCode == null || this.searchUlnNumber == null
				|| this.searchUlnCountryCode == '' || this.searchUlnNumber == '') {
				alert(this.translateService.instant('ULN CANNOT BE EMPTY'))

			} else {

				this.isSearchingParent = true;

				this.getByUlnSubscription
					.take(1)
					.subscribe(
						result => {
							this.foundParent = result;
							this.isParentFound = this.foundParent != null;
							this.isSearchingParent = false;
						},
						error => {
							this.isParentFound = false;
							this.isSearchingParent = false;
							alert(error);
						}
					);

				this.parentStorage.getByUln(this.searchUlnCountryCode, this.searchUlnNumber, this.getGenderType());
			}

		}
	}

	removeParent() {
		if (!this.isSearchingParent) {
			this.searchUlnCountryCode = null;
			this.searchUlnNumber = null;
			this.foundParent = null;
			this.isParentFound = true;
		}
	}

	useSelectedParent() {
		this.parent = this.foundParent;
		this.setUlnVarsOfParent();
		this.parentChange.emit(this.parent);
	}

	clickOK() {
		this.useSelectedParent();
		this.closeModal();
	}

	clickCancel() {
		this.closeModal();
	}

	openModal() {
		this.displayModal = 'block';
		// this.subscribeAll();
	}

	closeModal() {
		this.displayModal = 'none';
		this.isParentFound = false;
		// this.unsubscribeAll();
	}

	reset() {
		this.parent = this.initialParent;
		this.setUlnVarsOfParent();
		this.searchUlnCountryCode = this.ulnCountryCode;
		this.searchUlnNumber = this.ulnNumber;
		this.parentChange.emit(this.parent);
	}

	hasOriginalValues(): boolean {
		if (this.initialParent == null && this.parent == null) {
			return true;

		} else if (this.initialParent != null && this.parent != null) {
			return this.initialParent.id === this.parent.id
			&& this.initialParent.uln_country_code === this.parent.uln_country_code
			&& this.initialParent.uln_number === this.parent.uln_number
			;
		}
		return false;
	}

}