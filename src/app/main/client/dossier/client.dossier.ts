import _ from 'lodash';
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

@Component({
    directives: [REACTIVE_FORM_DIRECTIVES, LocationsDisplay, UsersDisplay],
    templateUrl: '/app/main/client/dossier/client.dossier.html',
    pipes: [TranslatePipe]
})

export class ClientDossierComponent {
    private modal_display = 'none';
    private provinces = [];
    private provinces$: Subscription;
    private pageTitle: string;
    private pageMode: string;
    private clientId: string;
    private dataSub: Subscription;

    private client: Client = new Client();

    private form: ControlGroup;
    private isValidForm: boolean = true;
    private modalDisplay: string = 'none';
    private errorMessage: string;
    private savingInProgress: boolean = false;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute, 
        private utils: UtilsService, 
        private fb: FormBuilder,
        private api: NSFOService
    ) {
        this.form = fb.group({
            company_name: ['', Validators.required],
            telephone_number: [''],
            company_relation_number: [''],
            debtor_number: [''],
            vat_number: [''],
            chamber_of_commerce_number: [''],
            address_street_name: [''],
            address_address_number: [''],
            address_suffix: [''],
            address_postal_code: [''],
            address_city: [''],
            address_state: [''],
            billing_address_street_name: [''],
            billing_address_address_number: [''],
            billing_address_suffix: [''],
            billing_address_postal_code: [''],
            billing_address_city: [''],
            billing_address_state: [''],
            notes: ['']
        });
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
            }
        });
    }

    ngOnDestroy() {
        this.provinces$.unsubscribe();
        this.dataSub.unsubscribe();
    }

    private initProvinces(): void {
        this.provinces$ = this.utils.getProvinces()
            .subscribe(res => {
                this.provinces = _.sortBy(res, ['code']);
            });
    }
    
    private getClientInfo() {
        this.api.doGetClientInfo()
            .subscribe(
                res => {
                    this.client = res.result;
                }
            );
    };
    
    private updateLocations(locations: Location[]): void {
        this.client.locations = locations;
    }

    private updateUsers(users: User[]): void {
        this.client.users = users;
    }

    private saveClient(): void {
        this.isValidForm = true;
        this.errorMessage = '';

        if (this.client.users.length == 0) {
            this.isValidForm = false;
            this.errorMessage = 'AT LEAST ONE USER IS REQUIRED';
            this.openModal();
        }

        if (this.client.locations.length == 0) {
            this.isValidForm = false;
            this.errorMessage = 'AT LEAST ONE LOCATION IS REQUIRED';
            this.openModal();
        }

        if (this.isValidForm) {
            if (this.form.valid) {
                this.savingInProgress = true;
                
                // TODO CONNECT TO API
                console.log(this.client);
                this.navigateTo('/client');
                
            } else {
                this.isValidForm = false;
                this.errorMessage = 'FILL IN ALL THE REQUIRED FIELDS';
                this.openModal();
            }
        }
    }
    
    private editClient(): void {
        
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
}
