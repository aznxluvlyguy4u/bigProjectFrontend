import _ from 'lodash';
import {Component, Input} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {AnimalHealthRequest} from "../../../health.model";
import {SettingsService} from "../../../../../global/services/settings/settings.service";

@Component({
    selector: 'health-table-all',
    templateUrl: '/app/main/health/inspections/components/tableAllRequests/inspections.tableAllRequests.html',
    pipes: [TranslatePipe]
})

export class HealthTableAll {
    private requests: AnimalHealthRequest[] = [];

    @Input() animalHealthRequests: AnimalHealthRequest[];

    constructor(private settings: SettingsService) {}
    ngOnChanges() {
        console.log('change');
        this.getRequests();
    }

    private getRequests(): void {
        for (let request of this.animalHealthRequests) {
            if(request.status == 'NEW' || request.status == '') {
                this.requests.push(request);
            }
        }
    }
}
