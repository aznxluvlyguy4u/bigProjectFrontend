import _ = require("lodash");
import {Component, Input, Output, OnInit, EventEmitter} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {LocationHealthInspection} from "../../../health.model";
import {SettingsService} from "../../../../../global/services/settings/settings.service";
import {NSFOService} from "../../../../../global/services/nsfo/nsfo.service";
import {LocationHealthStatus} from "../../../../client/client.model";
import {LivestockComponent} from "../../../../../global/components/livestock/livestock.component";
import {Animal} from "../../../../../global/components/livestock/livestock.model";
import { HealthService } from '../../../health.service';
import { Announcement } from '../../../health.model';

@Component({
    selector: 'health-table-announced',
    directives: [LivestockComponent],
    template: require('./inspections.tableAnnounced.html'),
    pipes: [TranslatePipe]
})

export class HealthTableAnnounced implements OnInit{

    @Output() inspectionsUpdate = new EventEmitter();
    @Output() _createInspection = new EventEmitter();
    @Output() _cancelAnnouncement = new EventEmitter();

    @Input()
    set announced(announced: Array<Announcement>) {
        this._announced = announced || [];
    }
    get announced(): Array<Announcement> { return this._announced; }

    private _announced: Array<Announcement> = [];

    // private requests: LocationHealthInspection[] = [];
    // private showModal: string = 'none';
    // private isUnhealthyLocation: boolean = false;
    // private isRequestingLocationHealth: boolean = false;
    // private isRequesting: boolean = false;
    // private selectedLocation: LocationHealthStatus;
    // private selectedAnimals: Animal[] = [];
    // private animals: Animal[] = [];

    constructor(private healthService:HealthService, private settings: SettingsService, private nsfo: NSFOService) {}

    ngOnInit(){ }

    ngOnDestroy(){ }

    cancelAnnouncement(announcement){
      this._cancelAnnouncement.emit(announcement)
    }

    createInspection(announcement){
        this._createInspection.emit(announcement);
    }

    // private getDocument(item: LocationHealthInspection) {
    //     let win = window.open('/loading', '_blank');
    //     let request = [
    //         {
    //             "ubn": item.ubn,
    //             "illness": item.inspection.replace(/\s/g, ''),
    //             "letter_type": 'support',
    //         }
    //     ];

    //     this.nsfo.doPostRequest(this.nsfo.URI_HEALTH_INSPECTIONS + '/' + 'letter', request)
    //         .subscribe(
    //             res => {
    //                 win.location.href = res.result;
    //             }
    //         );
    // }

    // private getBarCodeDocument(item: LocationHealthInspection) {
    //     let win = window.open('/loading', '_blank');
    //     let request = {
    //         "ubn": item.ubn,
    //         "inspection_id": item.inspection_id
    //     };

    //     this.nsfo.doPostRequest(this.nsfo.URI_HEALTH_INSPECTIONS + '/' + 'barcodes', request)
    //         .subscribe(
    //             res => {
    //                 win.location.href = res.result;
    //             }
    //         );
    // }

    // private changeStatus(request: LocationHealthInspection, event: Event, isToCancel: boolean = false): void {
    //     let button = event.target;
    //     button.disabled = true;
    //     button.innerHTML = '<i class="fa fa-gear fa-spin fa-fw"></i>';

    //     request.is_canceled = isToCancel;
    //     this.nsfo.doPutRequest(this.nsfo.URI_HEALTH_INSPECTIONS, request)
    //         .subscribe(
    //             res => {
    //                 let result = res.result;

    //                 if(isToCancel) {
    //                     request.status= 'NEW'
    //                 } else {
    //                     request.status = result.status;
    //                     request.next_action = result.next_action;
    //                     request.action_taken_by = {
    //                         "first_name": result.action_taken_by.first_name,
    //                         "last_name": result.action_taken_by.last_name
    //                     };
    //                 }

    //                 this.ngOnChanges();
    //             },
    //             err => {
    //                 button.disabled = false;
    //                 this.translate.get('START INSPECTION')
    //                     .subscribe(val => button.innerHTML = val);
    //             }
    //         )
    // }

    // private getLocationDetails() {
    //     this.isRequestingLocationHealth = true;
    //     this.nsfo.doGetRequest(this.nsfo.URI_HEALTH_UBN + '/' + this.inspection.ubn)
    //         .subscribe(
    //             res => {
    //                 this.selectedLocation = res.result;
    //                 this.getLivestock(this.inspection.ubn);
    //                 this.isRequestingLocationHealth = false;
    //             },
    //             err => {
    //                 this.isRequestingLocationHealth = false;
    //             }
    //         )
    // }

    // private getLivestock(ubn: string) {
    //     this.nsfo.doGetRequest(this.nsfo.URI_LIVESTOCK + '/' + ubn)
    //         .subscribe(
    //             res => {
    //                 this.animals = res.result;

    //                 for(let animal of this.animals) {
    //                     animal.date_of_birth_sort = animal.date_of_birth;
    //                     animal.date_of_birth = this.settings.convertToViewDate(animal.date_of_birth);

    //                     if(animal.uln_country_code && animal.uln_number) {
    //                         animal.uln = animal.uln_country_code + animal.uln_number;
    //                         animal.ulnLastFive = animal.uln_number.substr(animal.uln_number.length - 5);
    //                     }

    //                     if(animal.pedigree_country_code && animal.pedigree_number) {
    //                         animal.pedigree = animal.pedigree_country_code + animal.pedigree_number;
    //                     }
    //                     animal.selected = false;
    //                 }

    //                 this.animals = _.orderBy(this.animals, ['ulnLastFive'], ['asc']);
    //             }
    //         )
    // }

    // private checkLocationHealthStatus(illness: string) {
    //     this.inspection.inspection = illness;

    //     if (illness == 'SCRAPIE') {
    //         this.isUnhealthyLocation = !(this.selectedLocation.scrapie_status == 'FREE' ||
    //             this.selectedLocation.scrapie_status == 'RESISTANT');
    //     }

    //     if (illness == 'MAEDI VISNA') {
    //         this.isUnhealthyLocation = !(this.selectedLocation.maedi_visna_status == 'FREE_1_YEAR' ||
    //             this.selectedLocation.maedi_visna_status == 'FREE_2_YEAR');
    //     }

    //     if (illness == 'CAE') {
    //         this.isUnhealthyLocation = !(this.selectedLocation.cae_status != 'FREE_1_YEAR' &&
    //             this.selectedLocation.cae_status != 'FREE_2_YEAR');
    //     }

    //     if (illness == 'CL') {
    //         this.isUnhealthyLocation = !(this.selectedLocation.cl_status != 'FREE_1_YEAR' &&
    //             this.selectedLocation.cl_status != 'FREE_2_YEAR');
    //     }
    // }

    // private selectInspectionStatus (value: string) {
    //     this.inspection.certification_status = value;

    //     if (value == 'CERTIFICATION') {
    //         this.inspection.roadmap = 'ONE INSPECTION';
    //     }

    //     if (value == 'WITHOUT CERTIFICATION') {
    //         this.inspection.roadmap = '';
    //     }
    // }

    // private selectRoadmap (value: string) {
    //     this.inspection.roadmap = value;
    // }

//     private getSelectedAnimals(event: any) {
//         this.selectedAnimals = event;
//     }

//     private openModal() {
//         this.showModal = 'block';
//     }

//     private closeModal() {
//         this.showModal = 'none';
//         this.inspection = new LocationHealthInspection();
//         this.selectedLocation = null;
//         this.isUnhealthyLocation = false;
//     }
}
