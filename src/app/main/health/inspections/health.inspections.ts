import _ = require("lodash");
import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {HealthTableAll} from "./components/tableAllRequests/inspections.tableAllRequests";
import {HealthTableOngoing} from "./components/tableOngoing/inspections.tableOngoing";
import {HealthTableAuthorization} from "./components/tableAuthorization/inspections.tableAuthorization";
import {HealthTableExpired} from "./components/tableExpired/inspections.tableExpired";
import {HealthTableFinished} from "./components/tableFinished/inspections.tableFinished";
import {HealthTableAnnounced} from "./components/tableAnnounced/inspections.tableAnnounced";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {AnimalHealthRequest} from "../health.model";
import { Subscription } from 'rxjs/Subscription';

@Component({
    directives: [
        HealthTableAll,
        HealthTableAnnounced,
        HealthTableOngoing,
        HealthTableAuthorization,
        HealthTableExpired,
        HealthTableFinished
    ],
    template: require('./health.inspections.html'),
    pipes: [TranslatePipe]
})

export class HealthInspectionsComponent {
    private selectedTab: string = 'ALL REQUESTS';
    private animalHealthRequests: AnimalHealthRequest[] = [];
    private requestSub: Subscription;

    constructor(private nsfo: NSFOService) {
        this.getAnimalHealthRequests();
    }

    ngOnDestroy() {
        this.requestSub.unsubscribe();
    }
    
    private selectTab(selectedTab: string): void {
        this.selectedTab = selectedTab;
    }
    
    private getAnimalHealthRequests(): void {
       this.requestSub = this.nsfo.doGetRequest(this.nsfo.URI_HEALTH_INSPECTIONS)
            .subscribe(
                res => {
                    this.animalHealthRequests = res.result;
                }
            )
    }

    private getNewRequestAmount(): number {
        return _.filter(this.animalHealthRequests, ['status', 'NEW']).length
    }

    private getAnnouncedRequestAmount(): number {
        return _.filter(this.animalHealthRequests, ['status', 'ANNOUNCED']).length
    }

    private getOngoingRequestAmount(): number {
        return _.filter(this.animalHealthRequests, ['status', 'ONGOING']).length
    }

    private getAuthorizationRequestAmount(): number {
        return _.filter(this.animalHealthRequests, ['status', 'AUTHORIZATION']).length
    }

    private getExpiredRequestAmount(): number {
        return _.filter(this.animalHealthRequests, ['status', 'EXPIRED']).length
    }

    private getFinishedRequestAmount(): number {
        return _.filter(this.animalHealthRequests, ['status', 'FINISHED']).length
    }
}