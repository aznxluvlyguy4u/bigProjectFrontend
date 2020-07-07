import _ = require("lodash");
import {Component, Input, Output} from "@angular/core";
import {REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder} from "@angular/forms";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Location} from "../../../client.model";
import {UtilsService} from "../../../../../global/services/utils/utils.service";
import {SettingsService} from "../../../../../global/services/settings/settings.service";
import {Validators} from "@angular/common";
import {Subscription} from "rxjs/Rx";
import {EventEmitter} from "@angular/platform-browser-dynamic/src/facade/async";
import { Country } from '../../../../../global/models/country.model';
import { NSFOService } from '../../../../../global/services/nsfo/nsfo.service';
import { CountryNameToCountryCodePipe } from '../../../../../global/pipes/country-name-to-country-code.pipe';

@Component({
    selector: 'locations-display',
    directives: [REACTIVE_FORM_DIRECTIVES],
    template: require('./locations.component.html'),
    pipes: [TranslatePipe, CountryNameToCountryCodePipe]
})

export class LocationsDisplay {
    public objectKeys = Object.keys;

    private provinces = [];
    private provinces$: Subscription;
    private displayModal: string = 'none';
    private isModalEditMode: boolean = false;
    private hasUniqueUBNs: boolean = true;
    private isValidForm: boolean = true;
    private form: FormGroup;
    private location: Location = new Location();
    private selectedLocationKey: any;

    @Input() locations: Location[] = [];
    @Input() disabledMode: boolean = false;
    @Output() getLocations: EventEmitter<Location[]> = new EventEmitter<Location[]>();
    @Output() getDeletedLocations: EventEmitter<Location> = new EventEmitter<Location>();

    constructor(private fb: FormBuilder, private utils: UtilsService, public settings: SettingsService,
                private nsfo: NSFOService) {
        this.form = fb.group({
            ubn: ['', Validators.required],
            address_street_name: ['', Validators.required],
            address_address_number: ['', Validators.required],
            address_address_suffix: [''],
            address_address_postal_code: ['', Validators.required],
            address_address_city: ['', Validators.required],
            address_address_state: [''],
            address_country: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.initProvinces();
    }

    ngOnDestroy() {
        if (this.provinces$) {
            this.provinces$.unsubscribe();
        }
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

    public removeProvinceIfCountryIsNotNetherlands() {
        for (let location of this.locations) {
          if (location.address.country !== 'Netherlands') {
            location.address.state = null;
          }
        }
    }
    
    public openModal(editMode: boolean, selectedLocationKey?: any): void {
        this.isModalEditMode = editMode;
        this.displayModal = 'block';
        this.selectedLocationKey = selectedLocationKey;
    }

    public getModalLocation(): Location {
        if (this.isModalEditMode) {
            return this.locations[this.selectedLocationKey];
        }
        return this.location;
    }

    private closeModal(): void {
        this.displayModal = 'none';
        this.location = new Location();
        this.removeProvinceIfCountryIsNotNetherlands();
        this.resetValidation();
    }
    
    public addLocation(): void {
        this.isValidForm = true;

        if(this.form.valid && this.isValidForm) {
            let isUniqueUBN = this.checkForUniqueUBN(this.location);
            if(isUniqueUBN) {
                this.locations.push(this.location);
                this.getLocations.emit(this.locations);
                this.closeModal();
            } else {
                this.hasUniqueUBNs = false;
            }
        } else {
            this.isValidForm = false;
        }
    }

    public getLocationByKey(key: any): Location {
        return this.locations[key];
    }

    public removeLocation(key: any): void {
        const locationToDelete = this.getLocationByKey(key);
        _.remove(this.locations, locationToDelete);
        this.removeProvinceIfCountryIsNotNetherlands();
        this.getLocations.emit(this.locations);
			  this.getDeletedLocations.emit(locationToDelete);
    }
    
    public editLocation(): void {
        if(this.form.valid && this.isValidForm) {
            let isUniqueUBN = this.checkForUniqueUBN(this.location);
					console.log(isUniqueUBN);
            if(isUniqueUBN) {
                this.getLocations.emit(this.locations);
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
        return index < 0;
    }

    private resetValidation(): void {
        this.hasUniqueUBNs = true;
        this.isValidForm = true;
    }
}
