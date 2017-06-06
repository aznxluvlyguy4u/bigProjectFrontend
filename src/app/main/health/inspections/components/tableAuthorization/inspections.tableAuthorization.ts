import {Component, Input, Output, OnInit} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {SettingsService} from "../../../../../global/services/settings/settings.service";
import {LocationHealthInspection, LabResultScrapie, LabResultMaediVisna, LabResult} from "../../../health.model";
import { Router } from "@angular/router";
import { AuthorizationComponent } from "./authorization/tableAuthorization.authorization";
import { NSFOService } from "../../../../../global/services/nsfo/nsfo.service";
import { HealthService } from '../../../health.service';

@Component({
    selector: 'health-table-authorization',
    directives: [AuthorizationComponent],
    template: require('./inspections.tableAuthorization.html'),
    pipes: [TranslatePipe]
})

export class HealthTableAuthorization implements OnInit{
    private requests: LocationHealthInspection[] = [];
    private lab_result:LabResult = new LabResult();
    private showAuthPage = false;
    private selectedInspection: LocationHealthInspection = new LocationHealthInspection();

    @Input() animalHealthRequests: LocationHealthInspection[];

    private _toAuthorize: Array<LocationHealthInspection>;

    constructor(private settings: SettingsService, private router: Router, private nsfo: NSFOService) {}

    @Input()
    set toAuthorize(toAuthorize: Array<LocationHealthInspection>) {
        this._toAuthorize = toAuthorize || [];
    }
    get toAuthorize(): Array<LocationHealthInspection> { return this._toAuthorize; }

    ngOnInit(){ }

    // private getRequests(): void {
    //     this.requests = [];
    //     for (let request of this.animalHealthRequests) {
    //         if(request.status == 'AUTHORIZATION') {
    //             this.requests.push(request);
    //         }
    //     }
    // }

    // private getResults(inspectionId) {
    //     this.nsfo.doGetLabResultsRequest(inspectionId, this.selectedRequest.ubn)
    //         .subscribe(
    //             res => {
    //                 this.lab_result = res.result;
    //             }
    //         )
    // }

    private switchToAuthPage(inspection): void {
      console.log(inspection);
        this.selectedInspection = inspection;
        //this.getResults(request.inspection_id);
        this.showAuthPage = true;
    }

    private switchToOverviewPage(switchPage): void {
        this.showAuthPage = switchPage;
        //this.getRequests();
        this.selectedInspection = new LocationHealthInspection();
        this.lab_result = new LabResult;
    }
}
