import {Component} from "@angular/core";
import {NSFOService} from "../../global/services/nsfo/nsfo.service";
import {Dashboard} from "./dashboard.model";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";

@Component({
    directives: [ROUTER_DIRECTIVES],
    template: require('./dashboard.component.html'),
    pipes: [TranslatePipe]
})

export class DashboardComponent {
    private dashboard: Dashboard = new Dashboard;

    constructor(private nsfo: NSFOService, private router: Router) {
        this.getDashboardValues();
    }
    
    private getDashboardValues() {
        this.nsfo.doGetRequest(this.nsfo.URI_DASHBOARD)
            .subscribe(res => {
                this.dashboard = res.result;
            });
    }

    private navigateTo(route: string) {
        this.router.navigate([route]);
    }
}