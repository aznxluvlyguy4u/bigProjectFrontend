import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';

@Component({
	selector: 'app-year-dropdown',
	template: require('./year-dropdown.component.html'),
	pipes: [TranslatePipe]
})
export class YearDropdownComponent implements OnInit {
	@Input() allowNull = false;
	@Input() disabled: boolean = false;
	@Input() year: number;

	@Input() maxYear: number;
	@Input() minYear: number;
	@Input() stepsInYears: number = 1;

	@Output() yearChanged = new EventEmitter<number>();

	years: number[] = [];

	constructor() {}

	ngOnInit() {
		this.initializeYear();
		this.initializeMaxYear();
		this.initializeMinYear();
		this.generateYears();
	}

	initializeYear() {
		if (this.year === undefined) {
			this.year = null;
		}
	}

	initializeMaxYear() {
		if (!this.maxYear) {
			this.maxYear = (new Date()).getUTCFullYear();
		}
	}

	initializeMinYear() {
		if (!this.minYear || this.minYear > this.maxYear) {
			this.minYear = this.maxYear - 100;
		}
	}

	generateYears() {
		let year:number;
		for(year = this.maxYear; year >= this.minYear; year -= this.stepsInYears) {
			this.years.push(year);
		}
	}

	emitYearSelection() {
		this.yearChanged.emit(this.year);
	}

}