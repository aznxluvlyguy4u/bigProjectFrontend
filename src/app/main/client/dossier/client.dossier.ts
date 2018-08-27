import _ = require("lodash");
import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Router, ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {Client, User} from "../client.model";
import {ControlGroup, FormBuilder, Validators} from "@angular/common";
import {UsersDisplay} from "./component/users/users.component";
import {LocationsDisplay} from "./component/locations/locations.component";
import {UtilsService} from "../../../global/services/utils/utils.service";
import {REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {Datepicker} from "../../../global/components/datepicker/datepicker.component";
import {SettingsService} from "../../../global/services/settings/settings.service";
import { ClientsStorage } from '../../../global/services/storage/clients.storage';
import { Country } from '../../../global/models/country.model';
import { SpinnerBounceComponent } from '../../../global/components/spinner-bounce/spinner-bounce.component';

@Component({
    directives: [REACTIVE_FORM_DIRECTIVES, LocationsDisplay, UsersDisplay, Datepicker, SpinnerBounceComponent],
    template: require('./client.dossier.html'),
    pipes: [TranslatePipe]
})

export class ClientDossierComponent {
    private provinces = [];
    private provinces$: Subscription;
    private pageTitle: string;
    private pageMode: string;
    private clientId: string;
    private dataSub: Subscription;

    private client: Client = new Client();
    private clientTemp: Client;

    private form: ControlGroup;
    private isValidForm: boolean = true;
    private modalDisplay: string = 'none';
    private errorData: string;
    private errorMessage: string;
    private savingInProgress: boolean = false;

    private changeModalDisplay: string = 'none';
    private invoiceId: number;

    public isClientDataLoaded = false;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
				private clientsStorage: ClientsStorage,
        private utils: UtilsService, 
        private settings: SettingsService, 
        private fb: FormBuilder,
        private nsfo: NSFOService
    ) {
        this.form = fb.group({
            company_name: ['', Validators.required],
            telephone_number: [''],
            company_relation_number: [''],
            debtor_number: [''],
            vat_number: [''],
            chamber_of_commerce_number: [''],
            address_street_name: ['', Validators.required],
            address_address_number: ['', Validators.required],
            address_suffix: [''],
            address_postal_code: ['', Validators.required],
            address_city: ['', Validators.required],
            address_state: [''],
            address_country: ['', Validators.required],
            billing_address_street_name: ['', Validators.required],
            billing_address_address_number: ['', Validators.required],
            billing_address_suffix: [''],
            billing_address_postal_code: ['', Validators.required],
            billing_address_city: ['', Validators.required],
            billing_address_state: [''],
            billing_address_country: ['', Validators.required],
            animal_health_subscription: ['NO'],
            subscription_date: [''],
        });
        this.clearInvoiceId();
    }

    ngOnInit() {
        this.initProvinces();
        this.dataSub = this.activatedRoute.params.subscribe(params => {
            this.pageMode = params['mode'];

            if(this.pageMode == 'edit') {
                this.pageTitle = 'EDIT CLIENT';
                this.clientId = params['id'];
                this.getClientInfo();
            }

            if(this.pageMode == 'new') {
                this.pageTitle = 'NEW CLIENT';
                this.clientTemp = _.cloneDeep(this.client);
                this.isClientDataLoaded = true;
            }
        });

        this.router.routerState.queryParams.subscribe(params => {
            if (!!params['invoice_id']) {
							  this.invoiceId = params['invoice_id'];
            } else {
                this.invoiceId = null;
            }
        });
    }

    ngOnDestroy() {
        this.provinces$.unsubscribe();
        this.dataSub.unsubscribe();
        this.clearInvoiceId();
    }

    clearInvoiceId() {
        this.invoiceId = null;
    }

    public getCountries(): Country[] {
        return this.nsfo.countries;
    }

    private initProvinces(): void {
        this.provinces$ = this.utils.getProvinces()
            .subscribe(res => {
                this.provinces = _.sortBy(res, ['code']);
            });
    }
    
    private getClientInfo() {
        this.nsfo.doGetRequest(this.nsfo.URI_CLIENTS + '/' + this.clientId)
            .subscribe(
                res => {
                    this.client = res.result;
                    this.client.deleted_users = [];
                    this.client.deleted_locations = [];

                    if(this.client.animal_health_subscription) {
                        this.form.controls['animal_health_subscription'].updateValue('YES');
                        this.client.subscription_date = this.settings.convertToViewDate(this.client.subscription_date);
                    } else {
                        this.form.controls['animal_health_subscription'].updateValue('NO');
                    }

                    for(let user of this.client.users) {
                        user.primary_contactperson = false;
                    }

                    let user = this.client.owner;
                    user.primary_contactperson = true;
                    this.client.users.push(user);

                    this.clientTemp = _.cloneDeep(this.client);
                },
              error => {
                    alert(this.nsfo.getErrorMessage(error));
              },
              () => {
								    this.isClientDataLoaded = true;
              }
            )
    };
    
    private updateLocations(locations: Location[]): void {
        this.client.locations = locations;
    }

    private updateDeletedLocations(location: Location): void {
        this.client.deleted_locations.push(location);
    }

    private updateUsers(users: User[]): void {
        this.client.users = users;
    }

    private updateDeletedUsers(user: User): void {
        this.client.deleted_users.push(user);
    }

    public removeProvinceIfCountryIsNotNetherlands() {
        if (this.client.address.country !== 'Netherlands') {
            this.client.address.state = null;
        }

        if (this.client.billing_address.country !== 'Netherlands') {
            this.client.billing_address.state = null;
        }
    }

    public saveClient(): void {
        this.isValidForm = true;
        this.errorMessage = '';

        if (this.client.users.length == 0) {
            this.isValidForm = false;
            this.errorMessage = 'AT LEAST ONE USER IS REQUIRED';
            this.openModal();
        }
        
        if (this.isValidForm) {
            if (this.form.valid) {
                this.savingInProgress = true;

                let newClient = _.cloneDeep(this.client);

                if(this.form.controls['animal_health_subscription'].value == 'YES') {
                    newClient.animal_health_subscription = true;
                    newClient.subscription_date = this.form.controls['subscription_date'].value;
                } else {
                    newClient.animal_health_subscription = false;
                    newClient.subscription_date = '';
                }

                let owner = _.find(newClient.users, ['primary_contactperson', true]);
                _.remove(newClient.users, owner);

                newClient.owner = owner;
                newClient.deleted_locations = [];
                newClient.deleted_users = [];

                this.nsfo.doPostRequest(this.nsfo.URI_CLIENTS, newClient)
                    .subscribe(
                        res => {
                            this.savingInProgress = false;
                            this.clientsStorage.refresh();
													  this.navigateTo('/client/details/' + res.result.company_id);
                        },
                        err => {
                            let error = err.json();
                            this.errorData = error.data;
                            this.errorMessage = error.message;
                            this.openModal();
                            this.savingInProgress = false;
                        }
                    );
            } else {
                this.isValidForm = false;
                this.errorMessage = 'FILL IN ALL THE REQUIRED FIELDS';
                this.openModal();
            }
        }
    }
    
    public editClient(): void {
        this.isValidForm = true;
        this.errorMessage = '';

        let owner = _.find(this.client.users, ['primary_contactperson', true]);
        if (!owner) {
            this.isValidForm = false;
            this.errorMessage = 'A PRIMARY CONTACTPERSON IS REQUIRED';
            this.openModal();
        }
        
        if (this.isValidForm) {
            if (this.form.valid) {
                this.savingInProgress = true;

                let newClient = _.cloneDeep(this.client);

                if(this.form.controls['animal_health_subscription'].value == 'YES') {
                    newClient.animal_health_subscription = true;
                    newClient.subscription_date = this.form.controls['subscription_date'].value;
                } else {
                    newClient.animal_health_subscription = false;
                    newClient.subscription_date = '';
                }

                let owner = _.find(newClient.users, ['primary_contactperson', true]);
                _.remove(newClient.users, owner);

                newClient.owner = owner;

                this.nsfo.doPutRequest(this.nsfo.URI_CLIENTS + '/' + this.client.company_id, newClient)
                    .subscribe(
                        res => {
													  this.clientsStorage.refresh();
													  if (this.invoiceId) {
															this.navigateToInvoiceIfNotNull();
                            } else {
															this.navigateTo('/client/details/' + this.client.company_id);
                            }
                        },
                        err => {
                            let error = err.json();
                            this.errorData = error.data;
                            this.errorMessage = error.message;
                            this.openModal();
                            this.savingInProgress = false;
                        }
                    );

            } else {
                this.isValidForm = false;
                this.errorMessage = 'FILL IN ALL THE REQUIRED FIELDS';
                this.openModal();
            }
        }
    }

    private navigateToClientOverview(){
        if(this.checkForChanges()){
            this.navigateTo('/client');
        } else {
            this.openChangeModal();
        }
    }

    private checkForChanges() {
        if(_.isEqual(this.client, this.clientTemp)) {
            return true
        }
        return false
    }

    private openChangeModal() {
        this.changeModalDisplay = 'block';
    }

    private closeChangeModal() {
        this.changeModalDisplay = 'none';
    }

    private openModal() {
        this.modalDisplay = 'block';
    }

    private closeModal() {
        this.modalDisplay = 'none';
    }
    
    private navigateTo(url: string) {
        this.router.navigate([url]);
    }

    navigateToInvoiceIfNotNull(): void {
			const invoiceId = this.invoiceId;
			this.clearInvoiceId();
			if (invoiceId) {
				this.navigateTo('/invoice/details/edit/'+invoiceId);
			}
    }
}
