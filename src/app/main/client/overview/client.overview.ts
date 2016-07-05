import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
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

    constructor(private nsfoService: NSFOService, private settings: SettingsService) {
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
                    console.log(this.clientList);
                }
            );
    }
}

