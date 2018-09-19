import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import { IS_INVOICES_ACTIVE } from '../../global/constants/feature.activation';

@Component({
    directives: [ROUTER_DIRECTIVES],
    template: require('./config.component.html'),
    pipes: [TranslatePipe]
})

export class ConfigComponent {
    private selectedRoute: string = '/configuration/depart';

	  public isInvoicesActive = IS_INVOICES_ACTIVE;

    constructor(private router: Router) {}

    private navigateTo(url: string) {
        this.router.navigate([url]);
    }
}
