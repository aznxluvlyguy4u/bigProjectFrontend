import {Component, Input} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {SettingsService} from "../../../../../global/services/settings/settings.service";
import {AnimalHealthRequest} from "../../../health.model";
import {NSFOService} from "../../../../../global/services/nsfo/nsfo.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'health-table-finished',
    template: require('./inspections.tableFinished.html'),
    pipes: [TranslatePipe]
})

export class HealthTableFinished {
    private requests: AnimalHealthRequest[] = [];

    @Input() animalHealthRequests: AnimalHealthRequest[];

    private onDestroy$: Subject<void> = new Subject<void>();

    constructor(
        private settings: SettingsService,
        private nsfo: NSFOService,
    ) {}

    ngOnDestroy() {

    }

    ngOnChanges() {
        this.getRequests();
    }

    private getRequests(): void {
        for (let request of this.animalHealthRequests) {
            if(request.status == 'FINISHED') {
                this.requests.push(request);
            }
        }
    }

    private changeStatus(request: AnimalHealthRequest, event: Event): void {
        let button = event.target;
        button.disabled = true;
        button.innerHTML = '<i class="fa fa-gear fa-spin fa-fw"></i>';

        this.nsfo.doPutRequest(this.nsfo.URI_HEALTH_INSPECTIONS, request)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
                res => {
                    let result = res.result;
                    request.status = result.status;
                    request.next_action = result.next_action;
                    request.directions = result.directions;

                    this.ngOnChanges();
                },
                err => {
                    button.disabled = false;
                    this.translate.get('AUTHORIZE')
                        .pipe(takeUntil(this.onDestroy$))
                        .subscribe(val => button.innerHTML = val);
                }
            )
    }
}