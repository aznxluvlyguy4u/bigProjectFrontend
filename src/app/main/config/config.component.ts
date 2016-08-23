import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";

@Component({
    directives: [ROUTER_DIRECTIVES],
    template: require('./config.component.html'),
    pipes: [TranslatePipe]
})

export class ConfigComponent {
    private selectedRoute: string = '/configuration/depart';

    constructor(private router: Router) {}

    private navigateTo(url: string) {
        this.router.navigate([url]);
    }
}
