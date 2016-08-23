import _ = require("lodash");
import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Choice} from "../../../config.model";
import {Validators} from "@angular/common";
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {NSFOService} from "../../../../../global/services/nsfo/nsfo.service";

@Component({
    selector: 'choicefields-treatment',
    directives: [REACTIVE_FORM_DIRECTIVES],
    template: require('./choiceFields.treatment.html'),
    pipes: [TranslatePipe]
})

export class ChoiceFieldsTreatmentComponent {
    private choices: Choice[] = [];
    private choice: Choice = new Choice();
    private choiceTemp: Choice;
    private isModalEditMode: boolean;
    private displayModal: string = 'none';

    private isValidForm: boolean = true;

    private form: FormGroup;

    constructor(private nsfo: NSFOService, private fb: FormBuilder) {
        this.form = fb.group({
            choice: ['', Validators.required],
            order: ['', Validators.required]
        });
    }

    private addChoice(): void {
        this.isValidForm = true;

        if (this.form.valid && this.isValidForm) {
            this.choices.push(this.choice);
            this.choices = _.orderBy(this.choices, ['order', 'name'], ['asc', 'asc']);
            this.closeModal();
        } else {
            this.isValidForm = false;
        }
    }

    private removeChoice(choice: Choice): void {
        _.remove(this.choices, choice);
        this.choices = _.orderBy(this.choices, ['order', 'name'], ['asc', 'asc']);
    }

    private editChoice(): void {
        this.isValidForm = true;
        
        if (this.form.valid && this.isValidForm) {
            this.removeChoice(this.choiceTemp);
            this.choices.push(this.choice);
            this.choices = _.orderBy(this.choices, ['order', 'name'], ['asc', 'asc']);
            this.closeModal();
        } else {
            this.isValidForm = false;
        }
    }

    private openModal(editMode: boolean, choice: Choice): void {
        this.isModalEditMode = editMode;
        this.displayModal = 'block';

        if(editMode) {
            this.choice = _.cloneDeep(choice);
            this.choiceTemp = _.cloneDeep(choice);
        }
    }

    private closeModal(): void {
        this.displayModal = 'none';
        this.choice = new Choice();
        this.resetValidation();
    }

    private resetValidation(): void {
        this.isValidForm = true;
    }
}