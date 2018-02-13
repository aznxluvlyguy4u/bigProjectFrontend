import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { CollarStorage } from '../../services/storage/collar.storage';
@Component({
	selector: 'app-collar-input',
	template: require('./collar-input.component.html'),
	pipes: [TranslatePipe]
})
export class CollarInputComponent implements OnInit, OnChanges {
	@Input() disabled = false;

	@Input() collarColor: string;
	@Input() collarNumber: string;

	@Output() collarColorChange = new EventEmitter<string>();
	@Output() collarNumberChange = new EventEmitter<string>();

	initialColor: string;
	initialNumber: string;
	isColorDirty: boolean;
	isNumberDirty: boolean;

	constructor(private collarStorage: CollarStorage) {}

	@Input()
	updateInitialValues() {
		this.initialColor = this.collarColor;
		this.initialNumber = this.collarNumber;
	}

	ngOnInit() {
			this.initialColor = this.collarColor;
			this.initialNumber = this.collarNumber;
			this.isColorDirty = false;
			this.isNumberDirty = false;
	}

	ngOnChanges() {
		this.isColorDirty = this.initialColor != this.collarColor;
		this.isNumberDirty = this.initialNumber != this.collarNumber;
	}

	getCollars() {
		return this.collarStorage.collarColors;
	}

	changeColor() {
			this.collarColorChange.emit(this.collarColor);
	}

	changeNumber() {
			this.collarNumberChange.emit(this.collarNumber);
	}

	reset() {
			this.collarColor = this.initialColor;
			this.collarNumber = this.initialNumber;
			this.isColorDirty = false;
			this.isNumberDirty = false;

			this.collarColorChange.emit(this.collarColor);
			this.collarNumberChange.emit(this.collarNumber);
	}

	hasOriginalValues() {
		return this.collarColor === this.initialColor && this.collarNumber === this.initialNumber;
	}
}