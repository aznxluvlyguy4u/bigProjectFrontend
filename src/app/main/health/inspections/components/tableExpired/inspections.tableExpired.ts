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
    private requests: LocationHealthInspection[];

    @Input() animalHealthRequests: LocationHealthInspection[];

    constructor(private healthService:HealthService, private settings: SettingsService) {}

    ngOnInit(){
        this.healthService.toAuthorize$.subscribe(inspections => {
            this.requests = inspections;
        });
        this.healthService.fetchExpired();
    }

    // ngOnChanges() {
    //     this.getRequests();
    // }

    private getRequests(): void {
        let count = 1;
        this.requests = [];
        this.requests = _.filter(this.animalHealthRequests, ['status', 'FINISHED']);
        // for (let request of this.animalHealthRequests) 
        // {
        //     if(request.status == 'EXPIRED') 
        //     {
        //         this.requests.push(request);
        //         console.log(count++);
        //         console.log(request);
        //     }
        // }
        console.log(this.requests);
    }
}