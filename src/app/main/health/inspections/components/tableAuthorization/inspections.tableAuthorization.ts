import {Component, Input, Output} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {SettingsService} from "../../../../../global/services/settings/settings.service";
import {AnimalHealthRequest, LabResultScrapie, LabResultMaediVisna, LabResult} from "../../../health.model";
import {Router} from "@angular/router";
import {AuthorizationComponent} from "./authorization/tableAuthorization.authorization";
import {NSFOService} from "../../../../../global/services/nsfo/nsfo.service";

@Component({
    selector: 'health-table-authorization',
    directives: [AuthorizationComponent],
    template: require('./inspections.tableAuthorization.html'),
    pipes: [TranslatePipe]
})

export class HealthTableAuthorization {
    private requests: AnimalHealthRequest[] = [];
    private lab_result:LabResult = new LabResult();
    private showAuthPage = false;
    private selectedRequest: AnimalHealthRequest = new AnimalHealthRequest();
    
    @Input() animalHealthRequests: AnimalHealthRequest[];

    constructor(private settings: SettingsService, private router: Router, private nsfo: NSFOService) {}
    
    ngOnChanges() {
        this.getRequests();
    }

    private getRequests(): void {
        this.requests = [];
        for (let request of this.animalHealthRequests) {
            if(request.status == 'AUTHORIZATION') {
                this.requests.push(request);
            }
        }
    }
    
    private getResults(inspectionId) {
        this.nsfo.doGetLabResultsRequest(inspectionId, this.selectedRequest.ubn)
            .subscribe(
                res => {
                    this.lab_result = res.result;
                }
            )
    }

    private switchToAuthPage(request): void {
        this.selectedRequest = request;
        this.getResults(request.inspection_id);
        this.showAuthPage = true;
    }

    private switchToOverviewPage(switchPage): void {
        this.showAuthPage = switchPage;
        this.getRequests();
        this.selectedRequest = new AnimalHealthRequest();
        this.lab_result = new LabResult;
    }
}