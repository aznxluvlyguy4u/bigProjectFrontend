import _ from 'lodash';
import {Component, Input, Output} from "@angular/core";
import {REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, FormControl} from "@angular/forms";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Location} from "../../../client.model";
import {UtilsService} from "../../../../../global/services/utils/utils.service";
import {Datepicker} from "../../../../../global/components/datepicker/datepicker.component";
import {SettingsService} from "../../../../../global/services/settings/settings.service";
import {Validators} from "@angular/common";
import {Subscription} from "rxjs/Rx";
import {EventEmitter} from "@angular/platform-browser-dynamic/src/facade/async";

@Component({
    selector: 'locations-display',
    directives: [REACTIVE_FORM_DIRECTIVES, Datepicker],
    templateUrl: '/app/main/client/dossier/component/locations/locations.component.html',
    pipes: [TranslatePipe]
})

export class LocationsDisplay {
    private provinces = [];
    private provinces$: Subscription;
    private healthStatusses = [];
    private healthStatusses$: Subscription;
    private displayModal: string = 'none';
    private isModalEditMode: boolean = false;
    private hasUniqueUBNs: boolean = true;
    private isValidForm: boolean = true;
    private form: FormGroup;
    private location: Location = new Location();
    private locationTemp: Location;

    @Input() locations: Location[] = [];
    @Input() disabledMode: boolean = false;
    @Output() updated: EventEmitter<Location[]> = new EventEmitter<Location[]>();

    constructor(private fb: FormBuilder, private utils: UtilsService, public settings: SettingsService) {
        this.form = fb.group({
            ubn: ['', Validators.required],
            address_street_name: [],
            address_address_number: [],
            address_address_suffix: [],
            address_address_postal_code: [],
            address_address_city: [],
            address_address_state: [],
            health_animal_health: [],
            health_disease: [],
            health_date_since: [],
            health_date_till: [],
            health_health_status: [],
            health_health_statement: [],
            health_own_health_statement: []
        });
    }

    ngOnInit() {
        this.initProvinces();
        this.initHealthStatusses();
    }

    ngOnDestroy() {
        this.provinces$.unsubscribe();
    }

    private initProvinces(): void {
        this.provinces$ = this.utils.getProvinces()
            .subscribe(res => {
                this.provinces = _.sortBy(res, ['code']);
            });
    }

    private initHealthStatusses(): void {
        this.healthStatusses$ = this.utils.getHealthStatusses()
            .subscribe(res => {
                this.healthStatusses = res;
            });
    }

    private openModal(editMode: boolean, location: Location): void {
        this.isModalEditMode = editMode;
        this.displayModal = 'block';

        if(!editMode) {
            (<FormControl>this.form.controls['health_date_since']).updateValue('');
            (<FormControl>this.form.controls['health_date_till']).updateValue('');
        }

        if(editMode) {
            this.location = _.cloneDeep(location);
            this.locationTemp = _.cloneDeep(location);

            if(this.location.health.animal_health) {
                (<FormControl>this.form.controls['health_animal_health']).updateValue('YES');
                this.location.health.animal_health = 'YES';
            }

            if(!this.location.health.animal_health) {
                (<FormControl>this.form.controls['health_animal_health']).updateValue('NO');
                this.location.health.animal_health = 'NO';
            }

            if(this.location.health.own_health_statement) {
                (<FormControl>this.form.controls['health_own_health_statement']).updateValue('YES');
                this.location.health.own_health_statement = 'YES';
            }

            if(!this.location.health.own_health_statement) {
                (<FormControl>this.form.controls['health_own_health_statement']).updateValue('NO');
                this.location.health.own_health_statement = 'NO';
            }
        }
    }

    private closeModal(): void {
        this.displayModal = 'none';
        this.location = new Location();
        this.resetValidation();
    }


    private selectFile(event): void {
        this.location.health.health_statement = event.target.files[0];
    }

    private openFile(): void {
        let url = URL.createObjectURL(this.location.health.health_statement);
        window.open(url);
    }

    private removeFile(): void {
        this.location.health.health_statement = null;
    }
    
    private addLocation(): void {
        this.isValidForm = true;

        if(this.form.valid && this.isValidForm) {
            let isUniqueUBN = this.checkForUniqueUBN(this.location);

            if(isUniqueUBN) {
                if(this.form.controls['health_animal_health'].value == 'YES') {
                    this.location.health.animal_health = true;
                }

                if(this.form.controls['health_animal_health'].value == 'NO') {
                    this.location.health.animal_health= false;
                }

                if(this.form.controls['health_own_health_statement'].value == 'YES') {
                    this.location.health.own_health_statement = true;
                }

                if(this.form.controls['health_own_health_statement'].value == 'NO') {
                    this.location.health.own_health_statement= false;
                }

                this.locations.push(this.location);
                this.updated.emit(this.locations);
                this.closeModal();
            } else {
                this.hasUniqueUBNs = false;
            }
        } else {
            this.isValidForm = false;
        }
    }

    private removeLocation(location: Location): void {
        _.remove(this.locations, location);
        this.updated.emit(this.locations);
    }

    private editLocation(): void {
        if(this.form.valid && this.isValidForm) {
            let isUniqueUBN = this.checkForUniqueUBN(this.location);

            if(isUniqueUBN) {
                if(this.form.controls['health_animal_health'].value == 'YES') {
                    this.location.health.animal_health = true;
                }

                if(this.form.controls['health_animal_health'].value == 'NO') {
                    this.location.health.animal_health= false;
                }

                if(this.form.controls['health_own_health_statement'].value == 'YES') {
                    this.location.health.own_health_statement = true;
                }

                if(this.form.controls['health_own_health_statement'].value == 'NO') {
                    this.location.health.own_health_statement= false;
                }
                
                this.removeLocation(this.locationTemp);
                this.locations.push(this.location);
                this.updated.emit(this.locations);
                this.closeModal();
            } else {
                this.hasUniqueUBNs = false;
            }
        } else {
            this.isValidForm = false;
        }
    }

    private checkForUniqueUBN(location: Location) {
        let index = _.findIndex(this.locations, ['ubn', location.ubn]);

        if (this.locationTemp) {
            return index < 0 || this.locationTemp.ubn == this.location.ubn;
        }

        return index < 0;
    }

    private resetValidation(): void {
        this.hasUniqueUBNs = true;
        this.isValidForm = true;
    }
}
