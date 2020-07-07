import {Component} from "@angular/core";
import {NSFOService} from "../../global/services/nsfo/nsfo.service";
import {Dashboard} from "./dashboard.model";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import { SpinnerComponent } from '../../global/components/spinner/spinner.component';
import { IS_INVOICES_ACTIVE } from '../../global/constants/feature.activation';
import {Subscription} from "rxjs/Subscription";

@Component({
    directives: [ROUTER_DIRECTIVES, SpinnerComponent],
    template: require('./dashboard.component.html'),
    pipes: [TranslatePipe]
})

export class DashboardComponent {
    loadingInfo = false;
    private dashboard: Dashboard = new Dashboard;

    public isInvoicesActive = IS_INVOICES_ACTIVE;

    private requestSub: Subscription;

    constructor(private nsfo: NSFOService, private router: Router) {
        this.getDashboardValues();
    }

    ngOnDestroy() {
        this.requestSub.unsubscribe();
    }

    private getDashboardValues() {
			  this.loadingInfo = true;
        this.requestSub = this.nsfo.doGetRequest(this.nsfo.URI_DASHBOARD)
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