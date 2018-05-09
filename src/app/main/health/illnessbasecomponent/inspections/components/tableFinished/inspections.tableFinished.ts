import {Component, Input} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {SettingsService} from "../../../../../../global/services/settings/settings.service";
import {LocationHealthInspection} from "../../../../health.model";

@Component({
    selector: 'health-table-finished',
    template: require('./inspections.tableFinished.html'),
    pipes: [TranslatePipe]
})

export class HealthTableFinished {
    private _finished: Array<LocationHealthInspection> = [];

    @Input()
    set finished(finished: Array<LocationHealthInspection>) {
        this._finished = finished || [];
    }
    get finished(): Array<LocationHealthInspection> { return this._finished; }

    constructor(private settings: SettingsService) {}

    private changeStatus(request: LocationHealthInspection, event: Event): void {
        // let button = event.target;
        // button.disabled = true;
        // button.innerHTML = '<i class="fa fa-gear fa-spin fa-fw"></i>';

        // this.nsfo.doPutRequest(this.nsfo.URI_HEALTH_INSPECTIONS, request)
        //     .subscribe(
        //         res => {
        //             let result = res.result;
        //             request.status = result.status;
        //             request.next_action = result.next_action;
        //             request.directions = result.directions;

        //             // this.ngOnChanges();
        //         },
        //         err => {
        //             button.disabled = false;
        //             this.translate.get('AUTHORIZE')
        //                 .subscribe(val => button.innerHTML = val);
        //         }
        //     )
    }
}
