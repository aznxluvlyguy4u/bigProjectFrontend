import {Component, Input} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {AnimalHealthRequest} from "../../../health.model";
import {SettingsService} from "../../../../../global/services/settings/settings.service";

@Component({
    selector: 'health-table-ongoing',
    template: require('./inspections.tableOngoing.html'),
    pipes: [TranslatePipe]
})

export class HealthTableOngoing {
    private requests: AnimalHealthRequest[] = [];

    @Input() animalHealthRequests: AnimalHealthRequest[];

    constructor(private settings: SettingsService) {}

    ngOnChanges() {
        this.getRequests();
    }

    private getRequests(): void {
        for (let request of this.animalHealthRequests) {
            if(request.status == 'ONGOING') {
                this.requests.push(request);
            }
        }
    }
}