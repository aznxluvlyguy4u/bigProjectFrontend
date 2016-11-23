import _ = require("lodash");
import {Component, Input} from "@angular/core";
import {TranslatePipe, TranslateService} from "ng2-translate/ng2-translate";
import {AnimalHealthRequest} from "../../../health.model";
import {SettingsService} from "../../../../../global/services/settings/settings.service";
import {NSFOService} from "../../../../../global/services/nsfo/nsfo.service";
import {Http} from "@angular/http";

@Component({
    selector: 'health-table-all',
    template: require('./inspections.tableAllRequests.html'),
    pipes: [TranslatePipe]
})

export class HealthTableAll {
    private requests: AnimalHealthRequest[] = [];

    @Input() animalHealthRequests: AnimalHealthRequest[];

    constructor(private settings: SettingsService, private nsfo: NSFOService, private translate: TranslateService, private http: Http) {}

    ngOnChanges() {
        this.getRequests();
    }

    private getRequests(): void {
        this.requests = [];
        for (let request of this.animalHealthRequests) {
            if(request.status == 'NEW' || request.status == '') {
                this.requests.push(request);
            }
        }
    }

    private getDocument(item: AnimalHealthRequest) {
        let win = window.open('/loading', '_blank');
        let request = [{
                "ubn": item.ubn,
                "illness": item.inspection.replace(/\s/g, ''),
                "letter_type": 'announcement',
            }];

        this.nsfo.doPostRequest(this.nsfo.URI_HEALTH_INSPECTIONS + '/' + 'letter', request)
            .subscribe(
                res => {
                    win.location.href = res.result;
                }
            );
    }

    private getAllDocuments() {
        let win = window.open('/loading', '_blank');
        let requests = [];
        for (let animalHealthRequest of this.requests) {
            let request = {
                "ubn": animalHealthRequest.ubn,
                "illness": animalHealthRequest.inspection.replace(/\s/g, ''),
                "letter_type": 'announcement',
            };
            requests.push(request);
        };
        
        this.nsfo.doPostRequest(this.nsfo.URI_HEALTH_INSPECTIONS + '/' + 'letter', requests)
            .subscribe(
                res => {
                    win.location.href = res.result;
                }
            );
    }
    
    private changeStatus(request: AnimalHealthRequest, event: Event): void {
        let button = event.target;
        button.disabled = true;
        button.innerHTML = '<i class="fa fa-gear fa-spin fa-fw"></i>';

        this.nsfo.doPostRequest(this.nsfo.URI_HEALTH_INSPECTIONS, request)
            .subscribe(
                res => {
                    let result = res.result;
                    request.inspection_id = result.inspection_id;
                    request.status = result.status;
                    request.next_action = result.next_action;
                    request.action_taken_by = {
                        "first_name": result.action_taken_by.first_name,
                        "last_name": result.action_taken_by.last_name
                    };

                    this.ngOnChanges();
                },
                err => {
                    button.disabled = false;
                    this.translate.get('ANNOUNCE')
                        .subscribe(val => button.innerHTML = val);
                }
            )
    }
}
