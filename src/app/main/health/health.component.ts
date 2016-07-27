import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";

@Component({
    directives: [ROUTER_DIRECTIVES],
    templateUrl: '/app/main/health/health.component.html',
    pipes: [TranslatePipe]
})

export class HealthComponent {
    private selectedRoute: string = '/health/inspections';

    constructor(private router: Router) {}

    private navigateTo(url: string) {
        this.router.navigate([url]);
    }
}