import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { PedigreeRegisterStorage } from '../../services/storage/pedigree-register.storage';
import { PedigreeRegister } from '../../models/pedigree-register.model';
import { TranslatePipe } from 'ng2-translate';

@Component({
	selector: 'app-pedigree-register-dropdown',
	template: require('./pedigree-register-dropdown.component.html'),
	pipes: [TranslatePipe]
})
export class PedigreeRegisterDropdownComponent implements OnInit, OnChanges {

	@Input() disabled = false;
	@Input() selectedPedigreeRegisterId: number;
	@Output() pedigreeRegisterChange = new EventEmitter<PedigreeRegister>();

	isDirty = false;
	initialPedigreeRegisterId: number;

	constructor(private pedigreeRegisterStorage: PedigreeRegisterStorage) {
		this.pedigreeRegisterStorage.initialize();
	}

	@Input()
	updateInitialValues() {
		this.initialPedigreeRegisterId = this.selectedPedigreeRegisterId;
	}

	ngOnInit() {
		this.initialPedigreeRegisterId = this.selectedPedigreeRegisterId;
		this.isDirty = false;
	}

	ngOnChanges() {
		this.isDirty = !this.hasOriginalValues();
	}

	getPedigreeRegisters(): PedigreeRegister[] {
		return this.pedigreeRegisterStorage.pedigreeRegisters;
	}

	private emitChange() {
		const pedigreeRegister = this.pedigreeRegisterStorage.getById(this.selectedPedigreeRegisterId);
		this.pedigreeRegisterChange.emit(pedigreeRegister);
	}

	changePedigreeRegister() {
		this.emitChange();
	}

	@Input()
	reset() {
		this.selectedPedigreeRegisterId = this.initialPedigreeRegisterId;
		this.isDirty = false;
		this.emitChange();
	}

	hasOriginalValues() {
		return this.selectedPedigreeRegisterId === this.initialPedigreeRegisterId;
	}
}