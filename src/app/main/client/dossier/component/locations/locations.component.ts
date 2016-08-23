import _ = require("lodash");
import {Component, Input, Output} from "@angular/core";
import {REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, FormControl} from "@angular/forms";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Location} from "../../../client.model";
import {UtilsService} from "../../../../../global/services/utils/utils.service";
import {SettingsService} from "../../../../../global/services/settings/settings.service";
import {Validators} from "@angular/common";
import {Subscription} from "rxjs/Rx";
import {EventEmitter} from "@angular/platform-browser-dynamic/src/facade/async";

@Component({
    selector: 'locations-display',
    directives: [REACTIVE_FORM_DIRECTIVES],
    template: require('./locations.component.html'),
    pipes: [TranslatePipe]
})

export class LocationsDisplay {
    private provinces = [];
    private provinces$: Subscription;
    private displayModal: string = 'none';
    private isModalEditMode: boolean = false;
    private hasUniqueUBNs: boolean = true;
    private isValidForm: boolean = true;
    private form: FormGroup;
    private location: Location = new Location();
    private locationTemp: Location;

    @Input() locations: Location[] = [];
    @Input() disabledMode: boolean = false;
    @Output() getLocations: EventEmitter<Location[]> = new EventEmitter<Location[]>();
    @Output() getDeletedLocations: EventEmitter<Location> = new EventEmitter<Location>();

    constructor(private fb: FormBuilder, private utils: UtilsService, public settings: SettingsService) {
        this.form = fb.group({
            ubn: ['', Validators.required],
            address_street_name: ['', Validators.required],
            address_address_number: ['', Validators.required],
            address_address_suffix: [''],
            address_address_postal_code: ['', Validators.required],
            address_address_city: ['', Validators.required],
            address_address_state: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.initProvinces();
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
    
    private openModal(editMode: boolean, location: Location): void {
        this.isModalEditMode = editMode;
        this.displayModal = 'block';

        if(editMode) {
            this.location = _.cloneDeep(location);
            this.locationTemp = _.cloneDeep(location);
        }
    }

    private closeModal(): void {
        this.displayModal = 'none';
        this.location = new Location();
        this.resetValidation();
    }
    
    private addLocation(): void {
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

    private removeLocation(location: Location): void {
        _.remove(this.locations, location);
        this.getLocations.emit(this.locations);
    }

    private sendDeletedLocation(location: Location) {
        this.getDeletedLocations.emit(location);
    }
    
    private editLocation(): void {
        if(this.form.valid && this.isValidForm) {
            let isUniqueUBN = this.checkForUniqueUBN(this.location);

            if(isUniqueUBN) {
                this.removeLocation(this.locationTemp);
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
