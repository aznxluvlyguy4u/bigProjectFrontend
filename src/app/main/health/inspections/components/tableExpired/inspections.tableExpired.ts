import {Component, Input, OnInit} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {SettingsService} from "../../../../../global/services/settings/settings.service";
import {LocationHealthInspection} from "../../../health.model";
import _ = require("lodash");
import { HealthService } from '../../../health.service';

@Component({
    selector: 'health-table-expired',
    template: require('./inspections.tableExpired.html'),
    pipes: [TranslatePipe]
})

export class HealthTableExpired implements OnInit{

    private _expired: LocationHealthInspection[];

    @Input()
    set expired(expired: Array<LocationHealthInspection>) {
        this._expired = expired || [];
        console.log(expired);
    }
    get expired(): Array<LocationHealthInspection> { return this._expired; }

    constructor(private settings: SettingsService) {}

    ngOnInit(){ }
}
