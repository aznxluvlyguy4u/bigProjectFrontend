import {Router, ROUTER_DIRECTIVES} from "@angular/router";
import {
    CLIENT_NOTES_OVERVIEW_REPORT,
    MEMBERS_AND_USERS_OVERVIEW_REPORT
} from "../../../global/constants/report-type.constant";
import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate";
import {MembersAndUsersOverviewComponent} from "./members-and-users-overview/members-and-users-overview.component";

@Component({
    selector: 'app-clients-overview',
    template: require('./client-reports.component.html'),
    directives: [ROUTER_DIRECTIVES, MembersAndUsersOverviewComponent],
    pipes: [TranslatePipe]
})
export class ClientReportsComponent {
    selectedOption: string;

    private reportBaseUrl = '/report/client-reports/';

    constructor(private router: Router) {
        this.selectedOption = MEMBERS_AND_USERS_OVERVIEW_REPORT;
    }

    getClientReportOptions(): string[] {
        return [
            MEMBERS_AND_USERS_OVERVIEW_REPORT
        ];
    }

    loadClientReportComponent() {
        let url = this.reportBaseUrl;
        switch (this.selectedOption) {
            case MEMBERS_AND_USERS_OVERVIEW_REPORT: url += 'members-and-users-overview'; break;
            default: return;
        }
        this.navigateTo(url);
    }

    private navigateTo(url: string) {
        this.router.navigate([url]);
    }
}
