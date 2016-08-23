import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {ChoiceFieldsDepartComponent} from "./components/depart/choiceFields.depart";
import {ChoiceFieldsLossComponent} from "./components/loss/choiceFields.loss";
import {ChoiceFieldsTreatmentComponent} from "./components/treatment/choiceFields.treatment";
import {ChoiceFieldsContactComponent} from "./components/contact/choiceFields.contact";

@Component({
    directives: [ChoiceFieldsDepartComponent, ChoiceFieldsLossComponent, ChoiceFieldsTreatmentComponent, ChoiceFieldsContactComponent],
    template: require('./config.choiceFields.html'),
    pipes: [TranslatePipe]
})

export class ConfigChoiceFieldsComponent {}