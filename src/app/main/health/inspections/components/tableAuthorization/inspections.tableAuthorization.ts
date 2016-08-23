import {Component, Input} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {SettingsService} from "../../../../../global/services/settings/settings.service";
import {AnimalHealthRequest} from "../../../health.model";
import {Router} from "@angular/router";
import {AuthorizationComponent} from "./authorization/tableAuthorization.authorization";

@Component({
    selector: 'health-table-authorization',
    directives: [AuthorizationComponent],
    template: require('./inspections.tableAuthorization.html'),
    pipes: [TranslatePipe]
})

export class HealthTableAuthorization {
    private requests: AnimalHealthRequest[] = [];
    private showAuthPage = false;
    private selectedId = -1;

    @Input() animalHealthRequests: AnimalHealthRequest[];

    constructor(private settings: SettingsService, private router: Router) {}
    
    ngOnChanges() {
        this.getRequests();
    }

    private getRequests(): void {
        for (let request of this.animalHealthRequests) {
            if(request.status == 'AUTHORIZATION') {
                this.requests.push(request);
            }
        }
    }

    private switchToAuthPage(request_id: number): void {
        this.selectedId = request_id;
        this.showAuthPage = true;
    }

    private switchToOverviewPage(switchPage): void {
        this.showAuthPage = switchPage;
    }
}