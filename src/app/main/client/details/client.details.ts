import _ = require("lodash");
import moment = require("moment");
import {Component} from "@angular/core";
import {Subscription} from "rxjs/Rx";
import {ActivatedRoute, Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {
    ClientDetails, ClientNote, LocationHealthStatus, SCRAPIE_STATUS_OPTIONS,
    MAEDI_VISNA_STATUS_OPTIONS
} from "../client.model";
import {SettingsService} from "../../../global/services/settings/settings.service";
import {UtilsService} from "../../../global/services/utils/utils.service";
import {Datepicker} from "../../../global/components/datepicker/datepicker.component";
import {REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {ControlGroup, FormBuilder} from "@angular/common";

@Component({
    directives: [REACTIVE_FORM_DIRECTIVES, Datepicker],
    template: require('./client.details.html'),
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
    private form: ControlGroup;
    
    constructor(
        private router: Router,
        private nsfo: NSFOService,
        private activatedRoute: ActivatedRoute,
        private settings: SettingsService,
        private utils: UtilsService,
        private fb: FormBuilder
    ) {
        this.form = fb.group({
            "scrapie_check_date" : [''],
            "maedi_visna_check_date" : [''],
            "reason_of_change": [''],
            "scrapie_reason_of_edit": [''],
            "maedi_visna_reason_of_edit": ['']
        });
    }

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
        this.nsfo.doGetRequest(this.nsfo.URI_CLIENTS + '/' + this.clientId + '/details')
            .subscribe(res => {
                this.clientDetails = <ClientDetails> res.result;
            });
    }

    private getClientNotes(): void {
        this.nsfo.doGetRequest(this.nsfo.URI_CLIENTS + '/' + this.clientId  + '/notes')
            .subscribe(res => {
                this.clientNotes = <ClientNote[]> res.result;
                this.clientNotes = _.orderBy(this.clientNotes, ['creation_date'], ['desc']);
            });
    }

    private getHealthStatusses(): void {
        this.nsfo.doGetRequest(this.nsfo.URI_HEALTH_COMPANY + '/' + this.clientId)
            .subscribe(res => {
                this.healthStatusses = <LocationHealthStatus[]> res.result;
                for(let healthStatus of this.healthStatusses) {
                    healthStatus.scrapie_check_date = this.settings.convertToViewDate(healthStatus.scrapie_check_date);
                    healthStatus.maedi_visna_check_date = this.settings.convertToViewDate(healthStatus.maedi_visna_check_date);

                    this.form.controls['scrapie_check_date'].updateValue(healthStatus.scrapie_check_date);
                    this.form.controls['maedi_visna_check_date'].updateValue(healthStatus.maedi_visna_check_date);
                }
            });
    }
    
    private addClientNote(): void {
        if(this.clientNote.message) {
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
    }

    private loginAsGhost(personID: string) {
        window.open(window.location.origin + '/ghostlogin/' + personID);
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
            "maedi_visna_check_date": this.form.controls['maedi_visna_check_date'].value,
            "scrapie_status": this.selectedLocation.scrapie_status,
            "scrapie_check_date": this.form.controls['scrapie_check_date'].value,
            "maedi_visna_reason_of_edit": this.form.controls['maedi_visna_reason_of_edit'].value,
            "scrapie_reason_of_edit": this.form.controls['scrapie_reason_of_edit'].value,
        };

        this.nsfo.doPutRequest(this.nsfo.URI_HEALTH_UBN + '/' + this.selectedLocation.ubn, request)
            .subscribe(
                res => {
                    this.closeLocationHealthModal();
                    this.isChangingLocationHealth = false;
                },
                err => {
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
        this.tempSelectedLocation = _.clone(location);
        this.locationHealthModalDisplay = 'block';
    }

    private closeLocationHealthModal() {
        this.locationHealthModalDisplay = 'none';
    }

    private cancelLocationHealth() {
        this.selectedLocation = _.clone(this.tempSelectedLocation);
    }
}

