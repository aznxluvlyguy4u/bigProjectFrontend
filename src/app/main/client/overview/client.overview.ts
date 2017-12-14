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
    template: require('./client.overview.html'),
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
        this.nsfo.doGetRequest(this.nsfo.URI_CLIENTS)
            .subscribe(
                res => {
                    this.clientList = <Client[]> res.result;
                    this.isLoaded = true;
                }
            );
    }

    private loginAsGhost(personID: string) {
        window.open(window.location.origin + '/ghostlogin/' + personID);
    };

    private setCompanyActive(client: Client, is_active: boolean) {
        this.isSending = true;
        let request = {
            "is_active": is_active
        };

        this.nsfo.doPutRequest(this.nsfo.URI_CLIENTS + '/' + client.company_id + '/status', request)
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

