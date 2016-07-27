import _ from 'lodash';
import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {HealthTableAll} from "./components/tableAllRequests/inspections.tableAllRequests";
import {HealthTableOngoing} from "./components/tableOngoing/inspections.tableOngoing";
import {HealthTableAuthorization} from "./components/tableAuthorization/inspections.tableAuthorization";
import {HealthTableExpired} from "./components/tableExpired/inspections.tableExpired";
import {HealthTableFinished} from "./components/tableFinished/inspecitons.tableFinished";
import {HealthTableAnnounced} from "./components/tableAnnounced/inspections.tableAnnounced";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {AnimalHealthRequest} from "../health.model";

@Component({
    directives: [
        HealthTableAll,
        HealthTableAnnounced,
        HealthTableOngoing,
        HealthTableAuthorization,
        HealthTableExpired,
        HealthTableFinished
    ],
    templateUrl: '/app/main/health/inspections/health.inspections.html',
    pipes: [TranslatePipe]
})

export class HealthInspectionsComponent {
    private selectedTab: string = 'ALL REQUESTS';
    private animalHealthRequests: AnimalHealthRequest[] = [];
    
    constructor(private nsfo: NSFOService) {
        this.getAnimalHealthRequests();
    }
    
    private selectTab(selectedTab: string): void {
        this.selectedTab = selectedTab;
    }
    
    private getAnimalHealthRequests(): void {
        this.nsfo.doGetAnimalHealth()
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