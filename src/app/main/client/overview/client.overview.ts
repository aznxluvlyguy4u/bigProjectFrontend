import { AfterViewChecked, Component } from '@angular/core';
import { ROUTER_DIRECTIVES, Router } from '@angular/router';
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {Client} from "../client.model";
import {ClientFilterPipe} from "./pipes/clientFilter.pipe";
import {PaginationService, PaginatePipe} from "ng2-pagination/index";
import {PaginationComponent} from "../../../global/components/pagination/pagination.component";
import {SettingsService} from "../../../global/services/settings/settings.service";
import { CheckMarkComponent } from '../../../global/components/checkmark/check-mark.component';
import { CountryNameToCountryCodePipe } from '../../../global/pipes/country-name-to-country-code.pipe';
import { SortService } from '../../../global/services/utils/sort.service';
import { IS_INVOICES_ACTIVE } from '../../../global/constants/feature.activation';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare var $;

@Component({
    providers: [PaginationService],
    directives: [ROUTER_DIRECTIVES, PaginationComponent, CheckMarkComponent],
    template: require('./client.overview.html'),
    pipes: [TranslatePipe, ClientFilterPipe, PaginatePipe, CountryNameToCountryCodePipe]
})

export class ClientOverviewComponent implements AfterViewChecked{
    private isLoaded: boolean = false;
    private isSending: boolean = false;
    private clientList: Client[] = [];

    public filterSearch: string = '';
    public filterInvoices: string = 'ALL';
    public filterAmount: number = 10;
    public filterCountryName: string = 'ALL';

    private isLoadedFoundation: boolean;
    private userModalDisplay: string = 'none';
    private selectedClient: Client = new Client();

    public currentCountryNames: string[] = [];
    public countryNameNullFiller = '--';

    public isInvoicesActive = IS_INVOICES_ACTIVE;

    private onDestroy$: Subject<void> = new Subject<void>();

    constructor(private nsfo: NSFOService, private router: Router, private settings: SettingsService,
                private sort: SortService) {
        this.getClientList();
    }

    ngOnDestroy() {
        this.onDestroy$.next();
    }

    ngAfterViewChecked() {
        $(document).foundation();
    }

    private getClientList() {
        this.nsfo.doGetRequest(this.nsfo.URI_CLIENTS)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
                res => {
                    this.clientList = <Client[]> res.result;
                    this.generateCurrentCountryNamesList(this.clientList);
                },
              error => {
                    alert(this.nsfo.getErrorMessage(error));
              },
              () => {
								this.isLoaded = true;
              }
            );
    }

    private generateCurrentCountryNamesList(clientList: Client[]) {
        for (let client of clientList) {
            if (client.address && client.address.country) {
							if (this.currentCountryNames.indexOf(client.address.country) < 0) {
							    this.currentCountryNames.push(client.address.country);
              }
            }
            for (let locationDetails of client.locations_details) {
                if (!!locationDetails.country_details && !!locationDetails.country_details.name
                && this.currentCountryNames.indexOf(locationDetails.country_details.name) < 0) {
									this.currentCountryNames.push(locationDetails.country_details.name);
                }
            }
        }
        this.currentCountryNames = this.sort.sortCountryNames(this.currentCountryNames, true);
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
            .pipe(takeUntil(this.onDestroy$))
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

