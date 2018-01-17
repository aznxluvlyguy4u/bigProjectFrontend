import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';

@Component({
	selector: 'app-uln-input',
	template: require('./uln-input.component.html'),
	pipes: [TranslatePipe]
})
export class UlnInputComponent implements OnInit{
	@Input() countryCodeList = [];
	@Input() disabled = false;

	@Input() ulnCountryCode: string;
	@Input() ulnNumber: string;

	@Output() ulnCountryCodeChange = new EventEmitter<string>();
	@Output() ulnNumberChange = new EventEmitter<string>();

	initialCountryCode: string;
	initialNumber: string;
	isCountryCodeDirty: boolean;
	isNumberDirty: boolean;

	ngOnInit() {
			this.initialCountryCode = this.ulnCountryCode;
			this.initialNumber = this.ulnNumber;
			this.isCountryCodeDirty = false;
			this.isNumberDirty = false;
	}

	changeCountryCode() {
			this.ulnCountryCodeChange.emit(this.ulnCountryCode);
			this.isCountryCodeDirty = true;
	}

	changeNumber() {
			this.ulnNumberChange.emit(this.ulnNumber);
			this.isNumberDirty = true;
	}

	reset() {
			this.ulnCountryCode = this.initialCountryCode;
			this.ulnNumber = this.initialNumber;
			this.isCountryCodeDirty = false;
			this.isNumberDirty = false;
	}

	hasOriginalValues() {
		return this.ulnCountryCode === this.initialCountryCode && this.ulnNumber === this.initialNumber;
	}
}