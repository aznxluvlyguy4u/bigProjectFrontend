import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {Client} from "../client.model";
import {ClientFilterPipe} from "./pipes/clientFilter.pipe";
import {PaginationService, PaginatePipe} from "ng2-pagination/index";
import {PaginationComponent} from "../../../global/components/pagination/pagination.component";
import {SettingsService} from "../../../global/services/settings/settings.service";

declare var $;

@Component({
    providers: [PaginationService],
    directives: [ROUTER_DIRECTIVES, PaginationComponent],
    templateUrl: '/app/main/client/overview/client.overview.html',
    pipes: [TranslatePipe, ClientFilterPipe, PaginatePipe]
})

export class ClientOverviewComponent {
    private clientList: Client[] = [];
    private filterSearch: string = '';
    private filterInvoices: string = 'ALL';
    private filterAmount: number = 10;
    private isLoadedFoundation: boolean;

    constructor(private nsfoService: NSFOService, private router: Router, private settings: SettingsService) {
        this.getClientList();
    }

    ngAfterViewChecked() {
        $(document).foundation();
    }

    private getClientList() {
        this.nsfoService.doGetClients()
            .subscribe(
                res => {
                    this.clientList = <Client[]> res.result;
                }
            );
    }

    private loginAsGhost(clientID: number) {
        let request = {
            "company_id": clientID
        };
        
        this.nsfoService.doPostRequest('/v1/admins/ghost', request)
            .subscribe(
                res => {
                    let ghostToken = res.result.ghost_token;
                    let accessToken = localStorage['access_token'];
                    window.location.href= this.nsfoService.getUserEnvURL() + '/ghostlogin/' + ghostToken + '/' + accessToken;
                }
            );
    };

    private navigateTo(url: string) {
        this.router.navigate([url]);
    }
}

