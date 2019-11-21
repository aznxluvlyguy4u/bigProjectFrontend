import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import { SpinnerComponent } from '../../global/components/spinner/spinner.component';
import { CalculateService } from "../../global/services/calculate/calculate.service";

@Component({
    directives: [ROUTER_DIRECTIVES, SpinnerComponent],
    template: require('./calculations.component.html'),
    pipes: [TranslatePipe]
})

export class CalculationsComponent {
    loadingInfo = false;

    constructor(private router: Router, private calculateService: CalculateService) { }

    private navigateTo(route: string) {
        this.router.navigate([route]);
    }

    private calculateStarEwes() {
        this.calculateService.doAnimalHealthStatusReportGetRequest();
    }
}
