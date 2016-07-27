import {Component, Input} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {AnimalHealthRequest} from "../../../health.model";
import {SettingsService} from "../../../../../global/services/settings/settings.service";

@Component({
    selector: 'health-table-announced',
    templateUrl: '/app/main/health/inspections/components/tableAnnounced/inspections.tableAnnounced.html',
    pipes: [TranslatePipe]
})

export class HealthTableAnnounced {
    private requests: AnimalHealthRequest[] = [];

    @Input() animalHealthRequests: AnimalHealthRequest[];

    constructor(private settings: SettingsService) {}
    
    ngOnChanges() {
        this.getRequests();
    }

    private getRequests(): void {
        for (let request of this.animalHealthRequests) {
            if(request.status == 'ANNOUNCED') {
                this.requests.push(request);
            }
        }
    }
}
