import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {Client, User, MAEDI_VISNA_STATUS_OPTIONS, SCRAPI_STATUS_OPTIONS} from "../client.model";
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
    private isLoaded: boolean = false;
    private isSending: boolean = false;
    private clientList: Client[] = [];
    private filterSearch: string = '';
    private filterInvoices: string = 'ALL';
    private filterAmount: number = 10;
    private isLoadedFoundation: boolean;
    private userModalDisplay: string = 'none';
    private selectedClient: Client = new Client();

    constructor(private nsfo: NSFOService, private router: Router, private settings: SettingsService) {
        this.getClientList();
    }

    ngAfterViewChecked() {
        $(document).foundation();
    }

    private getClientList() {
        this.nsfo.doGetRequest(this.nsfo.URI_CLIENT_OVERVIEW)
            .subscribe(
                res => {
                    this.clientList = <Client[]> res.result;
                    this.isLoaded = true;
                }
            );
    }

    private loginAsGhost(personID: string) {
        let request = {
            "person_id": personID
        };
        
        this.nsfo.doPostRequest(this.nsfo.URI_GHOST_LOGIN, request)
            .subscribe(
                res => {
                    let ghostToken = res.result.ghost_token;
                    let accessToken = localStorage['access_token'];
                    window.location.href= this.nsfo.getUserEnvURL() + '/ghostlogin/' + ghostToken + '/' + accessToken;
                }
            );
    };

    private setCompanyActive(client: Client, is_active: boolean) {
        this.isSending = true;
        let request = {
            "is_active": is_active
        };

        this.nsfo.doPutRequest(this.nsfo.URI_CLIENT_INACTIVE + '/' + client.company_id, request)
            .subscribe(res => {
                client.status = is_active;
                this.isSending = false;
            });
    }

    private navigateTo(url: string) {
        this.router.navigate([url]);
    }

    private openUserModal(client: Client) {
        this.selectedClient = client;
        this.userModalDisplay = 'block';
    }

    private closeUserModal() {
        this.userModalDisplay = 'none';
    }
}

