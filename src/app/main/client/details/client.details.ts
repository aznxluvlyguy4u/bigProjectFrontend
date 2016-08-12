import _ from 'lodash';
import moment from 'moment';
import {Component} from "@angular/core";
import {Subscription} from "rxjs/Rx";
import {Routxer, ActivatedRoute} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {
    ClientDetails, ClientNote, LocationHealthStatus, SCRAPIE_STATUS_OPTIONS,
    MAEDI_VISNA_STATUS_OPTIONS
} from "../client.model";
import {SettingsService} from "../../../global/services/settings/settings.service";
import {UtilsService} from "../../../global/services/utils/utils.service";

@Component({
    templateUrl: '/app/main/client/details/client.details.html',
    pipes: [TranslatePipe]
})

export class ClientDetailsComponent {
    private dataSub: Subscription;
    private clientId: string;
    private clientDetails: ClientDetails = new ClientDetails();
    private clientNotes: ClientNote[] = [];
    private clientNote: ClientNote = new ClientNote();
    private userModalDisplay: string = 'none';
    private locationHealthModalDisplay: string = 'none';
    private isSavingNote: boolean = false;
    private isSending: boolean = false;
    private isChangingLocationHealth: boolean = false;
    private healthStatusses: LocationHealthStatus[] = [];
    private selectedLocation: LocationHealthStatus = new LocationHealthStatus();
    private tempSelectedLocation: LocationHealthStatus = new LocationHealthStatus();
    private maediVisnaStatusOptions: string[] = MAEDI_VISNA_STATUS_OPTIONS;
    private scrapieStatusOptions: string[] = SCRAPIE_STATUS_OPTIONS;
    
    constructor(
        private router: Router,
        private nsfo: NSFOService,
        private activatedRoute: ActivatedRoute,
        private settings: SettingsService,
        private utils: UtilsService
    ) {}

    ngOnInit() {
        this.dataSub = this.activatedRoute.params.subscribe(params => {
            this.clientId = params['id'];
            this.getClientDetails();
            this.getHealthStatusses();
            this.getClientNotes();
        });
    }
    
    ngOnDestroy() {
        this.dataSub.unsubscribe()
    }

    private getClientDetails(): void {
        this.nsfo.doGetRequest(this.nsfo.URI_CLIENT_DETAILS + '/' + this.clientId + '/details')
            .subscribe(res => {
                console.log(res);
                this.clientDetails = <ClientDetails> res.result;
            });
    }

    private getClientNotes(): void {
        this.nsfo.doGetRequest(this.nsfo.URI_CLIENT_NOTES + '/' + this.clientId + '/notes')
            .subscribe(res => {
                console.log(res);
                this.clientNotes = <ClientNote[]> res.result;
                this.clientNotes = _.orderBy(this.clientNotes, ['creation_date'], ['desc']);
            });
    }

    private getHealthStatusses(): void {
        this.nsfo.doGetRequest(this.nsfo.URI_HEALTH_COMPANY + '/' + this.clientId)
            .subscribe(res => {
                console.log(res);
                this.healthStatusses = <LocationHealthStatus[]> res.result;
            });
    }
    
    private addClientNote(): void {
        this.isSavingNote = true;
        let request = {
            "note": this.clientNote.message
        };

        this.nsfo.doPostRequest(this.nsfo.URI_CLIENTS + '/' + this.clientId + '/notes', request)
            .subscribe(res => {
                let note: ClientNote = res.result;
                this.clientNote.creator.first_name = note.creator.first_name;
                this.clientNote.creator.last_name = note.creator.last_name;
                this.clientNote.creation_date = moment().format();
                this.clientNotes.push(this.clientNote);
                this.clientNotes = _.orderBy(this.clientNotes, ['creation_date'], ['desc']);
                this.clientNote = new ClientNote();
                this.isSavingNote = false;
            });
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

    private setCompanyActive(is_active: boolean) {
        this.isSending = true;
        let request = {
            "is_active": is_active
        };

        this.nsfo.doPutRequest(this.nsfo.URI_CLIENTS + '/' + this.clientDetails.company_id + '/status', request)
            .subscribe(res => {
                this.clientDetails.status = is_active;
                this.isSending = false;
            });
    }

    private setLocationHealthStatus() {
        this.isChangingLocationHealth = true;

        let request = {
            "maedi_visna_status": this.selectedLocation.maedi_visna_status,
            "scrapie_status": this.selectedLocation.scrapie_status,
        };

        this.nsfo.doPutRequest(this.nsfo.URI_HEALTH_UBN + '/' + this.selectedLocation.ubn, request)
            .subscribe(
                () => {
                    this.closeLocationHealthModal();
                    this.isChangingLocationHealth = false;
                }
            );
    }

    private navigateTo(url: string): void {
        this.router.navigate([url]);
    }

    private openUserModal() {
        this.userModalDisplay = 'block';
    }

    private closeUserModal() {
        this.userModalDisplay = 'none';
    }

    private openLocationHealthModal(location: LocationHealthStatus) {
        this.selectedLocation = location;
        this.tempSelectedLocation = location;
        this.locationHealthModalDisplay = 'block';
    }

    private closeLocationHealthModal() {
        this.selectedLocation = this.tempSelectedLocation;
        this.locationHealthModalDisplay = 'none';
    }
}

