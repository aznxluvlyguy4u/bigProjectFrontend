import {Component} from "@angular/core";
import {NSFOService} from "../../global/services/nsfo/nsfo.service";
import {Dashboard} from "./dashboard.model";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import { SpinnerComponent } from '../../global/components/spinner/spinner.component';

@Component({
    directives: [ROUTER_DIRECTIVES, SpinnerComponent],
    template: require('./dashboard.component.html'),
    pipes: [TranslatePipe]
})

export class DashboardComponent {
    loadingInfo = false;
    private dashboard: Dashboard = new Dashboard;

    constructor(private nsfo: NSFOService, private router: Router) {
        this.getDashboardValues();
    }
    
    private getDashboardValues() {
			  this.loadingInfo = true;
        this.nsfo.doGetRequest(this.nsfo.URI_DASHBOARD)
            .subscribe(res => {
                this.dashboard = res.result;
            },
            err => {
                    alert(this.nsfo.getErrorMessage(err));
							      this.loadingInfo = false;
                },
              () => {
								    this.loadingInfo = false;
              }
            );
    }

    private navigateTo(route: string) {
        this.router.navigate([route]);
    }
}