import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import { SpinnerComponent } from '../../global/components/spinner/spinner.component';
import {CalculateService} from "../../global/services/calculate/calculate.service";

@Component({
    directives: [ROUTER_DIRECTIVES, SpinnerComponent],
    template: require('./calculations.component.html'),
    pipes: [TranslatePipe]
})

export class CalculationsComponent {
    loadingInfo = false;

    constructor(private calculateService: CalculateService) { }

    private calculateStarEwes() {
        this.calculateService.doStarEwesCalculationTaskGetRequest();
    }

    private calculateInbreedingCoefficient() {
        this.calculateService.doInbreedingCoefficientCalculationTaskGetRequest();
    }

    private recalculateInbreedingCoefficient() {
        this.calculateService.doInbreedingCoefficientRecalculationTaskGetRequest();
    }
}
