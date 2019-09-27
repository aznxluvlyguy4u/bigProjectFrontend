import _ = require("lodash");
import moment = require("moment");
import {Component} from "@angular/core";
import {Subscription} from "rxjs/Rx";
import {ActivatedRoute, Router} from "@angular/router";
import { TranslatePipe, TranslateService } from 'ng2-translate/ng2-translate';
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
import {DownloadService} from "../../../global/services/download/download.service";
import {Invoice} from "../../invoice/invoice.model";
import { SpinnerBounceComponent } from '../../../global/components/spinner-bounce/spinner-bounce.component';
import { IS_INVOICES_ACTIVE } from '../../../global/constants/feature.activation';

@Component({
    directives: [REACTIVE_FORM_DIRECTIVES, Datepicker, SpinnerBounceComponent],
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
    animalHealthSubscriptionSelection: string;
    animalHealthSubscription = false;
    showScrapieDatePicker: boolean;
    showMaediVisnaDatePicker: boolean;

    public loadingClientDetails = false;
    public loadingHealthStatusses = false;
    public loadingClientNotes = false;

    private healthStatusses: LocationHealthStatus[] = [];
    private selectedLocation: LocationHealthStatus = new LocationHealthStatus();
    private tempSelectedLocation: LocationHealthStatus = new LocationHealthStatus();
    private maediVisnaStatusOptions: string[] = MAEDI_VISNA_STATUS_OPTIONS;
    private scrapieStatusOptions: string[] = SCRAPIE_STATUS_OPTIONS;
    private form: ControlGroup;

    public isInvoicesActive = IS_INVOICES_ACTIVE;
    
    constructor(
        private downloadService: DownloadService,
        private router: Router,
        private nsfo: NSFOService,
        private activatedRoute: ActivatedRoute,
        private settings: SettingsService,
        private utils: UtilsService,
        private fb: FormBuilder,
        private translate: TranslateService,
    ) {
        this.form = fb.group({
            "animal_health_subscription": [false],
            "scrapie_check_date" : [''],
            "maedi_visna_check_date" : [''],
            "scrapie_reason_of_edit": [''],
            "maedi_visna_reason_of_edit": ['']
        });
    }

    ngOnInit() {
			  this.animalHealthSubscriptionSelection = this.translate.instant('NO');
			  this.setAnimalHealthSubscription();
			  this.showScrapieDatePicker = true;
			  this.showMaediVisnaDatePicker = true;

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
        this.loadingClientDetails = true;
        this.nsfo.doGetRequest(this.nsfo.URI_CLIENTS + '/' + this.clientId + '/details')
            .subscribe(res => {
                this.clientDetails = <ClientDetails> res.result;
            },
              error => {
                alert(this.nsfo.getErrorMessage(error));
              },
              () => {
                this.loadingClientDetails = false;
              });
    }

    private getClientNotes(): void {
        this.loadingClientNotes = true;
        this.nsfo.doGetRequest(this.nsfo.URI_CLIENTS + '/' + this.clientId  + '/notes')
            .subscribe(res => {
                this.clientNotes = <ClientNote[]> res.result;
                this.clientNotes = _.orderBy(this.clientNotes, ['creation_date'], ['desc']);
            },
							error => {
								alert(this.nsfo.getErrorMessage(error));
							},
							() => {
								this.loadingClientNotes = false;
							});
    }

    private getHealthStatusses(): void {
        this.loadingHealthStatusses = true;
        this.nsfo.doGetRequest(this.nsfo.URI_HEALTH_COMPANY + '/' + this.clientId)
            .subscribe(res => {
                this.setHealthResults(res);
            },
							error => {
								alert(this.nsfo.getErrorMessage(error));
							},
							() => {
								this.loadingHealthStatusses = false;
							});
    }

    private setHealthResults(healthStatusResult: any) {
        this.healthStatusses = <LocationHealthStatus[]> healthStatusResult.result;
        for(let healthStatus of this.healthStatusses) {
            this.setLocationHealthEditModalValues(healthStatus, true);
        }

        this.setAnimalHealthSubscriptionSelection();
    }

    setLocationHealthEditModalValues(LocationHealthStatus: LocationHealthStatus, isInitialSetting: boolean = false) {
    		if (isInitialSetting) {
						LocationHealthStatus.scrapie_check_date = this.settings.convertToViewDate(LocationHealthStatus.scrapie_check_date);
						LocationHealthStatus.maedi_visna_check_date = this.settings.convertToViewDate(LocationHealthStatus.maedi_visna_check_date);
				}

        if (LocationHealthStatus.scrapie_status == null) {
            LocationHealthStatus.scrapie_status = 'BLANK';
					  this.showScrapieDatePicker = false;
        }

        if (LocationHealthStatus.maedi_visna_status == null) {
            LocationHealthStatus.maedi_visna_status = 'BLANK';
					  this.showMaediVisnaDatePicker = false;
        }

        this.animalHealthSubscription = LocationHealthStatus.animal_health_subscription;
        this.form.controls['scrapie_check_date'].updateValue(LocationHealthStatus.scrapie_check_date);
        this.form.controls['maedi_visna_check_date'].updateValue(LocationHealthStatus.maedi_visna_check_date);
        this.form.controls['scrapie_reason_of_edit'].updateValue(LocationHealthStatus.scrapie_reason_of_edit);
        this.form.controls['maedi_visna_reason_of_edit'].updateValue(LocationHealthStatus.maedi_visna_reason_of_edit);
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

    private downloadClientNotesOverview(): void {
        let request = {
            "client_id": this.clientId
        };

        this.nsfo.doPostRequest(this.nsfo.URI_POST_CLIENT_NOTES_OVERVIEW, request)
            .subscribe(res => {

                // console.log(res)

                // let note: ClientNote = res.result;
                // this.clientNote.creator.first_name = note.creator.first_name;
                // this.clientNote.creator.last_name = note.creator.last_name;
                // this.clientNote.creation_date = moment().format();
                // this.clientNotes.push(this.clientNote);
                // this.clientNotes = _.orderBy(this.clientNotes, ['creation_date'], ['desc']);
                // this.clientNote = new ClientNote();
                // this.isSavingNote = false;
            });
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
        if (this.animalHealthSubscription) {

        		const maediVisnaCheckDate = !this.showMaediVisnaDatePicker ? undefined : this.form.controls['maedi_visna_check_date'].value;
        		const scrapieCheckDate = !this.showScrapieDatePicker ? undefined : this.form.controls['scrapie_check_date'].value;

            let request = {
                "maedi_visna_status": this.selectedLocation.maedi_visna_status,
                "maedi_visna_check_date": maediVisnaCheckDate,
                "scrapie_status": this.selectedLocation.scrapie_status,
                "scrapie_check_date": scrapieCheckDate,
                "maedi_visna_reason_of_edit": this.form.controls['maedi_visna_reason_of_edit'].value,
                "scrapie_reason_of_edit": this.form.controls['scrapie_reason_of_edit'].value,
                "animal_health_subscription": this.animalHealthSubscription,
            };

            this.setLocationHealthStatusBase(request);

        } else {
					let request = {
						"animal_health_subscription": this.animalHealthSubscription,
					};

					this.setLocationHealthStatusBase(request);
        }
    }

    private setLocationHealthStatusBase(request: any) {
			this.isChangingLocationHealth = true;

			this.nsfo.doPutRequest(this.nsfo.URI_HEALTH_UBN + '/' + this.selectedLocation.ubn, request)
				.subscribe(
					res => {
						this.setHealthResults(res);
						this.closeLocationHealthModal();
						this.isChangingLocationHealth = false;
					},
					err => {
						this.isChangingLocationHealth = false;
						alert(this.getLocationHealthErrorMessage(err));
					}
				);
    }

    private getLocationHealthErrorMessage(err: any): string {
        const body = err.json();

        if (body.code === 500) {
            return "SOMETHING WENT WRONG. TRY ANOTHER TIME.";
        }

			  const errors = body.errors;
			  let errorMessages = (Object.keys(errors).length === 1 ? 'Error': 'Errors') + ': ';
			  let i = 1;
			  console.log(Object.keys(errors).length);
        for (let errorMessageKey in errors) {
					  errorMessages += i + '. ' + this.translate.instant(errors[errorMessageKey]) + '.   ';
					  i++;
					  console.log(errors[errorMessageKey], this.translate.instant(errors[errorMessageKey]));
        }

        return errorMessages;
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

	  setAnimalHealthSubscription() {
        this.animalHealthSubscription = this.animalHealthSubscriptionSelection === this.translate.instant('YES');
    }

    setAnimalHealthSubscriptionSelection() {
        if (this.animalHealthSubscription) {
            this.animalHealthSubscriptionSelection = this.translate.instant('YES');
        } else {
					  this.animalHealthSubscriptionSelection = this.translate.instant('NO');
        }
    }

    updateMaediVisnaInput() {
    		this.showMaediVisnaDatePicker = this.selectedLocation.maedi_visna_status !== 'BLANK';
    }

    updateScrapieInput() {
				this.showScrapieDatePicker = this.selectedLocation.scrapie_status !== 'BLANK';
    }

    public downloadPdf(invoice: Invoice) {
        this.downloadService.doInvoicePdfGetRequest(invoice);
    }
}

