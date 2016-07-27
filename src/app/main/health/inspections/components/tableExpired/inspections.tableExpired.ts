import {Component, Input} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {SettingsService} from "../../../../../global/services/settings/settings.service";
import {AnimalHealthRequest} from "../../../health.model";

@Component({
    selector: 'health-table-expired',
    templateUrl: '/app/main/health/inspections/components/tableExpired/inspections.tableExpired.html',
    pipes: [TranslatePipe]
})

export class HealthTableExpired {
    private requests: AnimalHealthRequest[] = [];

    @Input() animalHealthRequests: AnimalHealthRequest[];

    constructor(private settings: SettingsService) {}

    ngOnChanges() {
        this.getRequests();
    }

    private getRequests(): void {
        for (let request of this.animalHealthRequests) {
            if(request.status == 'EXPIRED') {
                this.requests.push(request);
            }
        }
    }
}