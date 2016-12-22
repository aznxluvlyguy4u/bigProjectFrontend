import {Component, Input} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {AnimalHealthRequest} from "../../../health.model";
import {SettingsService} from "../../../../../global/services/settings/settings.service";
import {NSFOService} from "../../../../../global/services/nsfo/nsfo.service";

@Component({
    selector: 'health-table-announced',
    template: require('./inspections.tableAnnounced.html'),
    pipes: [TranslatePipe]
})

export class HealthTableAnnounced {
    private requests: AnimalHealthRequest[] = [];

    @Input() animalHealthRequests: AnimalHealthRequest[];

    constructor(private settings: SettingsService, private nsfo: NSFOService) {}
    
    ngOnChanges() {
        this.getRequests();
    }

    private getRequests(): void {
        this.requests = [];
        for (let request of this.animalHealthRequests) {
            if(request.status == 'ANNOUNCED') {
                this.requests.push(request);
            }
        }
    }

    private getDocument(item: AnimalHealthRequest) {
        let win = window.open('/loading', '_blank');
        let request = [
            {
                "ubn": item.ubn,
                "illness": item.inspection.replace(/\s/g, ''),
                "letter_type": 'support',
            }
        ];

        this.nsfo.doPostRequest(this.nsfo.URI_HEALTH_INSPECTIONS + '/' + 'letter', request)
            .subscribe(
                res => {
                    win.location.href = res.result;
                }
            );
    }
    
    private getBarCodeDocument(item: AnimalHealthRequest) {
        let win = window.open('/loading', '_blank');
        let request = {
            "ubn": item.ubn,
            "inspection_id": item.inspection_id
        };

        this.nsfo.doPostRequest(this.nsfo.URI_HEALTH_INSPECTIONS + '/' + 'barcodes', request)
            .subscribe(
                res => {
                    win.location.href = res.result;
                }
            );
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
