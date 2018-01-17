import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';

@Component({
	selector: 'app-stn-input',
	template: require('./stn-input.component.html'),
	pipes: [TranslatePipe]
})
export class StnInputComponent implements OnInit{
	@Input() countryCodeList = [];
	@Input() disabled = false;

	@Input() pedigreeCountryCode: string;
	@Input() pedigreeNumber: string;

	@Output() pedigreeCountryCodeChange = new EventEmitter<string>();
	@Output() pedigreeNumberChange = new EventEmitter<string>();

	initialCountryCode: string;
	initialNumber: string;
	isCountryCodeDirty: boolean;
	isNumberDirty: boolean;

	ngOnInit() {
			this.initialCountryCode = this.pedigreeCountryCode;
			this.initialNumber = this.pedigreeNumber;
			this.isCountryCodeDirty = false;
			this.isNumberDirty = false;
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
	}

	hasOriginalValues() {
		return this.pedigreeCountryCode === this.initialCountryCode && this.pedigreeNumber === this.initialNumber;
	}
}