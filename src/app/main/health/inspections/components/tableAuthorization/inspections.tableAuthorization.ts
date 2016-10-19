import {Component, Input} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {SettingsService} from "../../../../../global/services/settings/settings.service";
import {AnimalHealthRequest} from "../../../health.model";
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
    private results = [];
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
        this.nsfo.doGetRequest(this.nsfo.URI_HEALTH_INSPECTIONS + '/' + inspectionId + '/results')
            .subscribe(
                res => {
                    this.results = res.result;
                }
            )
    }

    private switchToAuthPage(request): void {
        this.getResults(request.inspection_id);
        this.selectedRequest = request;
        this.showAuthPage = true;
    }

    private switchToOverviewPage(switchPage): void {
        this.showAuthPage = switchPage;
        this.selectedRequest = new AnimalHealthRequest();
        this.results = [];
    }
}