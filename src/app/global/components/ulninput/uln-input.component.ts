import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { NSFOService } from '../../services/nsfo/nsfo.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
	selector: 'app-uln-input',
	template: require('./uln-input.component.html'),
	directives: [SpinnerComponent],
	pipes: [TranslatePipe]
})
export class UlnInputComponent implements OnInit, OnChanges {
	@Input() disabled = false;

	@Input() ulnCountryCode: string;
	@Input() ulnNumber: string;

	@Output() ulnCountryCodeChange = new EventEmitter<string>();
	@Output() ulnNumberChange = new EventEmitter<string>();

	initialCountryCode: string;
	initialNumber: string;
	isCountryCodeDirty: boolean;
	isNumberDirty: boolean;

	constructor(private nsfo: NSFOService) {}

	@Input()
	updateInitialValues() {
			this.initialCountryCode = this.ulnCountryCode;
			this.initialNumber = this.ulnNumber;
	}

	ngOnInit() {
			this.initialCountryCode = this.ulnCountryCode;
			this.initialNumber = this.ulnNumber;
			this.isCountryCodeDirty = false;
			this.isNumberDirty = false;
	}

	ngOnChanges() {
			this.isCountryCodeDirty = this.initialCountryCode != this.ulnCountryCode;
			this.isNumberDirty = this.initialNumber != this.ulnNumber;
	}

	getCountryCodeList() {
			return this.nsfo.countryCodeList;
	}

	changeCountryCode() {
			this.ulnCountryCodeChange.emit(this.ulnCountryCode);
	}

	changeNumber() {
			this.ulnNumberChange.emit(this.ulnNumber);
	}

	reset() {
			this.ulnCountryCode = this.initialCountryCode;
			this.ulnNumber = this.initialNumber;
			this.isCountryCodeDirty = false;
			this.isNumberDirty = false;

			this.ulnCountryCodeChange.emit(this.ulnCountryCode);
			this.ulnNumberChange.emit(this.ulnNumber);
	}

	hasOriginalValues() {
		return this.ulnCountryCode === this.initialCountryCode && this.ulnNumber === this.initialNumber;
	}
}