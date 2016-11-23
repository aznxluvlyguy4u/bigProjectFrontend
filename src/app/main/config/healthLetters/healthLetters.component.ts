import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";

@Component({
    directives: [ROUTER_DIRECTIVES],
    template: require('./healthLetters.component.html'),
    pipes: [TranslatePipe]
})

export class HealthLettersComponent {

}