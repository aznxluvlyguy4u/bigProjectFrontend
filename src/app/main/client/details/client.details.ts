import _ from 'lodash';
import moment from 'moment';
import {Component} from "@angular/core";
import {Subscription} from "rxjs/Rx";
import {Router, ActivatedRoute} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {ClientDetails, ClientNote} from "../client.model";
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
            this.getClientNotes();
        });
    }
    
    ngOnDestroy() {
        this.dataSub.unsubscribe()
    }

    private getClientDetails(): void {
        this.nsfo.doGetClientDetails()
            .subscribe(res => {
                this.clientDetails = <ClientDetails> res.result;
            })
    }

    private getClientNotes(): void {
        this.nsfo.doGetClientNotes()
            .subscribe(res => {
                this.clientNotes = <ClientNote[]> res.result;
                this.clientNotes = _.orderBy(this.clientNotes, ['creation_date'], ['desc']);
            })
    }
    
    private addClientNote(): void {
        this.utils.getUserDetails()
            .subscribe(res => {
                this.clientNote.created_by = res.first_name + ' ' + res.last_name;
                this.clientNote.creation_date = moment().format();
                console.log(this.clientNote);
                this.clientNotes.push(this.clientNote);
                this.clientNotes = _.orderBy(this.clientNotes, ['creation_date'], ['desc']);
                this.clientNote = new ClientNote();

            })
    }

    private loginAsGhost(): void {
        let request = {
            "company_id": this.clientId
        };

        this.nsfo.doPostRequest('/v1/admins/ghost', request)
            .subscribe(
                res => {
                    let ghostToken = res.result.ghost_token;
                    let accessToken = localStorage['access_token'];
                    window.location.href= this.nsfo.getUserEnvURL() + '/ghostlogin/' + ghostToken + '/' + accessToken;
                }
            );
    };


    private navigateTo(url: string): void {
        this.router.navigate([url]);
    }
}

