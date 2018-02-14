import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { NSFOService } from '../../services/nsfo/nsfo.service';

@Component({
	selector: 'app-country-selector',
	template: require('./country-selector.component.html'),
	pipes: [TranslatePipe]
})
export class CountrySelectorComponent implements OnInit, OnChanges {
	@Input() disabled = false;
	@Input() includeResetButton = false;

	@Input() countryName: string;

	@Output() countryNameChange = new EventEmitter<string>();

	initialCountryName: string;
	isDirty: boolean;

	constructor(private nsfo: NSFOService) {}

	@Input()
	updateInitialValues() {
		this.initialCountryName = this.countryName;
	}

	ngOnInit() {
		this.initialCountryName = this.countryName;
		this.isDirty = false;
	}

	ngOnChanges() {
		this.isDirty = this.initialCountryName != this.countryName;
	}

	getCountries() {
		return this.nsfo.countries;
	}

	changeCountryName() {
		this.countryNameChange.emit(this.countryName);
	}

	reset() {
		this.countryName = this.initialCountryName;
		this.isDirty = false;

		this.changeCountryName();
	}

	hasOriginalValues() {
		return this.countryName === this.initialCountryName;
	}
}