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
    private _isLoading: boolean;

    @Input() animalHealthRequests: LocationHealthInspection[];

    private _toAuthorize: Array<LocationHealthInspection>;

    constructor(private settings: SettingsService, private router: Router, private nsfo: NSFOService) {}

    @Input()
    set toAuthorize(toAuthorize: Array<LocationHealthInspection>) {
        this._toAuthorize = toAuthorize || [];
    }
    get toAuthorize(): Array<LocationHealthInspection> { return this._toAuthorize; }

    @Input()
    set isLoading(isLoading: boolean) {
        this._isLoading = isLoading;
    }

    ngOnInit(){ }

    private switchToAuthPage(inspection): void {
        this.selectedInspection = inspection;
        this.showAuthPage = true;
    }

    private switchToOverviewPage(switchPage): void {
        this.showAuthPage = switchPage;
        this.selectedInspection = new LocationHealthInspection();
        this.lab_result = new LabResult;
    }
}
