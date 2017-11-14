import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-search-component',
	template: `<input #input type="text" (keyup)="updateValue(input.value)" name="isearch" placeholder="Zoeken">`
})
export class SearchComponent implements OnInit {

	@Output() update = new EventEmitter();
	constructor() { }

	ngOnInit() {
		this.update.emit('');
	}

	updateValue(value) {
		this.update.emit(value);
	}
}