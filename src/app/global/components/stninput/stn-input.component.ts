import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { NSFOService } from '../../services/nsfo/nsfo.service';

@Component({
	selector: 'app-stn-input',
	template: require('./stn-input.component.html'),
	pipes: [TranslatePipe]
})
export class StnInputComponent implements OnInit, OnChanges {
	@Input() disabled = false;

	@Input() pedigreeCountryCode: string;
	@Input() pedigreeNumber: string;

	@Output() pedigreeCountryCodeChange = new EventEmitter<string>();
	@Output() pedigreeNumberChange = new EventEmitter<string>();

	initialCountryCode: string;
	initialNumber: string;
	isCountryCodeDirty: boolean;
	isNumberDirty: boolean;

	constructor(private nsfo: NSFOService) {}

	@Input()
	updateInitialValues() {
		this.initialCountryCode = this.pedigreeCountryCode;
		this.initialNumber = this.pedigreeNumber;
	}

	ngOnInit() {
			this.initialCountryCode = this.pedigreeCountryCode;
			this.initialNumber = this.pedigreeNumber;
			this.isCountryCodeDirty = false;
			this.isNumberDirty = false;
	}

	ngOnChanges() {
		this.isCountryCodeDirty = this.initialCountryCode != this.pedigreeCountryCode;
		this.isNumberDirty = this.initialNumber != this.pedigreeNumber;
	}

	getCountryCodeList() {
		return this.nsfo.countryCodeList;
	}

	changeCountryCode() {
			this.pedigreeCountryCodeChange.emit(this.pedigreeCountryCode);
			this.isCountryCodeDirty = true;
	}

	changeNumber() {
			this.pedigreeNumberChange.emit(this.pedigreeNumber);
			this.isNumberDirty = true;
	}

	reset() {
			this.pedigreeCountryCode = this.initialCountryCode;
			this.pedigreeNumber = this.initialNumber;
			this.isCountryCodeDirty = false;
			this.isNumberDirty = false;

			this.pedigreeCountryCodeChange.emit(this.pedigreeCountryCode);
			this.pedigreeNumberChange.emit(this.pedigreeNumber);
	}

	hasOriginalValues() {
		return this.pedigreeCountryCode === this.initialCountryCode && this.pedigreeNumber === this.initialNumber;
	}
}