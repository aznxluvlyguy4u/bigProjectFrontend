import _ = require("lodash");
import {Component, OnInit} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {HealthTableToAnnounce} from "./components/tableToAnnounce/inspections.tableToAnnounce";
import {HealthTableToReceiveLabResults} from "./components/tableToReceiveLabResults/inspections.tableToReceiveLabResults";
import {HealthTableAuthorization} from "./components/tableAuthorization/inspections.tableAuthorization";
import {HealthTableExpired} from "./components/tableExpired/inspections.tableExpired";
import {HealthTableFinished} from "./components/tableFinished/inspections.tableFinished";
import {HealthTableAnnounced} from "./components/tableAnnounced/inspections.tableAnnounced";
import {LocationHealthInspection} from "../health.model";
import { HealthService } from "../health.service";

@Component({
    directives: [
        HealthTableToAnnounce,
        HealthTableAnnounced,
        HealthTableToReceiveLabResults,
        HealthTableAuthorization,
        HealthTableExpired,
        HealthTableFinished
    ],
    providers: [ HealthService ],
    template: require('./health.inspections.html'),
    pipes: [TranslatePipe]
})

export class HealthInspectionsComponent implements OnInit {
    private selectedTab: string = 'ALL REQUESTS';
    private animalHealthRequests: LocationHealthInspection[] = [];

    private toAnnounceCount:number = 0;
    private announcedCount:number = 0;
    private ongoingCount:number = 0;
    private toAuthorizeCount:number = 0;
    private finishedCount:number = 0;
    private expiredCount:number = 0;

    private toAnnounce:Array<any>;
    private announced:Array<any>;
    private toReceiveLabResults:Array<any>;

    private ongoing:Array<LocationHealthInspection>;
    private toAuthorize:Array<LocationHealthInspection>;
    private finished:Array<LocationHealthInspection>;
    private expired:Array<LocationHealthInspection>;

    private toAnnounceIsLoading: boolean;
    private announcedIsLoading: boolean;
    private finishedIsLoading: boolean;
    private toReceiveLabResultsIsLoading: boolean;
    private expiredIsLoading: boolean;

    constructor(private healthService:HealthService) { }


    ngOnDestroy(){
        // TODO: Kill all subscriptions
    }

    ngOnInit(){
        this.healthService.toAnnounceIsLoading$.subscribe(res => {
            this.toAnnounceIsLoading = res;
        });
        this.healthService.announcedIsLoading$.subscribe(res => {
            this.announcedIsLoading = res;
        });
        this.healthService.toReceiveLabResultsIsLoading$.subscribe(res => {
            this.toReceiveLabResultsIsLoading = res;
        });
        this.healthService.finishedIsLoading$.subscribe(res => {
            this.finishedIsLoading = res;
        });
        this.healthService.expiredIsLoading$.subscribe(res => {
            this.expiredIsLoading = res;
        });

        // Suscribe and Load locations that should be announced
        this.healthService.toAnnounce$
            .subscribe(locations => {
                if(locations) {
                    this.toAnnounceCount = locations.length;
                    this.toAnnounce = locations;
                }
            });
        this.healthService.loadToAnnounce('maedi_visna');


        // // Suscribe and Load Announced inspections
        this.healthService.announced$
            .subscribe(inspections => {
                if(inspections) {
                    this.announcedCount = inspections.length;
                    this.announced = inspections;
                }
            });
        this.healthService.loadAnnounced('maedi_visna');

        // Suscribe and Load To Ongoing inspections
        this.healthService.toReceiveLabResults$
            .subscribe(inspections => {
                if(inspections) {
                    this.ongoingCount = inspections.length;
                    this.toReceiveLabResults = inspections;
                }
            });
        this.healthService.loadToReceiveLabResults('maedi_visna');

        // // Suscribe and Load To Authorize inspections
        this.healthService.toAuthorize$
            .subscribe(inspections => {
                console.log('RESULT');
                console.log(inspections);
                if(inspections) {
                    this.toAuthorizeCount = inspections.length;
                    this.toAuthorize = inspections;
                }
          });
        this.healthService.loadToAuthorize('maedi_visna');

        // Suscribe and Load To Finished inspections
        this.healthService.finished$.subscribe(inspections => {
            if(inspections) {
                console.log(inspections);
                this.finishedCount = inspections.length;
                this.finished = inspections;
            }
        });
        this.healthService.loadFinished('maedi_visna');

        // Suscribe and Load To Expired inspections
        this.healthService.expired$.subscribe(inspections => {
            if(inspections) {
                this.expiredCount = inspections.length;
                this.expired = inspections;
            }
        });
        this.healthService.loadExpired('maedi_visna');
    }

    private selectTab(selectedTab: string): void {
        this.selectedTab = selectedTab;
    }

    private createAnnouncement(location){
        this.healthService.createAnnouncement(location, "MAEDI VISNA");
    }

    private createAnnouncements(locations){
        this.healthService.createAnnouncements(locations, "MAEDI VISNA");
    }

    private cancelAnnouncement(announcement) {
      this.healthService.cancelAnnouncement(announcement);
    }

    private createInspection(announcement) {
      this.healthService.createInspection(announcement, "MAEDI VISNA");
    }

    private cancelInspection(inspection) {
      this.healthService.cancelInspection(inspection);
    }
}
