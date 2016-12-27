import _ = require("lodash");
import {Component, Input} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {AnimalHealthRequest} from "../../../health.model";
import {SettingsService} from "../../../../../global/services/settings/settings.service";
import {NSFOService} from "../../../../../global/services/nsfo/nsfo.service";

@Component({
    selector: 'health-table-ongoing',
    template: require('./inspections.tableOngoing.html'),
    pipes: [TranslatePipe]
})

export class HealthTableOngoing {
    private requests: AnimalHealthRequest[] = [];

    @Input() animalHealthRequests: AnimalHealthRequest[];

    constructor(private settings: SettingsService, private nsfo: NSFOService) {}

    ngOnChanges() {
        this.getRequests();
    }

    private getRequests(): void {
        this.requests = [];
        for (let request of this.animalHealthRequests) {
            if(request.status == 'ONGOING') {
                this.requests.push(request);
                this.requests = _.orderBy(this.requests, ['request_date'], ['desc'])
            }
        }
    }

    private changeStatus(request: AnimalHealthRequest, event: Event, isToCancel: boolean = false): void {
        let button = event.target;
        button.disabled = true;
        button.innerHTML = '<i class="fa fa-gear fa-spin fa-fw"></i>';

        request.is_canceled = isToCancel;
        this.nsfo.doPutRequest(this.nsfo.URI_HEALTH_INSPECTIONS, request)
            .subscribe(
                res => {
                    let result = res.result;

                    if(isToCancel) {
                        request.status= 'NEW'
                    } else {
                        request.status = result.status;
                        request.next_action = result.next_action;
                        request.action_taken_by = {
                            "first_name": result.action_taken_by.first_name,
                            "last_name": result.action_taken_by.last_name
                        };
                    }

                    this.ngOnChanges();
                },
                err => {
                    button.disabled = false;
                    this.translate.get('START INSPECTION')
                        .subscribe(val => button.innerHTML = val);
                }
            )
    }
}