import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { NSFOService } from '../../global/services/nsfo/nsfo.service';

@Injectable()
export class HealthService {

    private toAnnounce = new Subject()
    private announced = new Subject();
    private ongoing = new Subject();
    private toAuthorize = new Subject();
    private finished = new Subject();
    private expired = new Subject();

    private toAnnounce$ = this.toAnnounce.asObservable();
    private announced$ = this.announced.asObservable();
    private toAuthorize$$ = this.toAuthorize.asObservable();
    private ongoing$ = this.ongoing.asObservable();
    private finished$ = this.finished.asObservable();
    private expired$ = this.expired.asObservable();

    private _dataStore = {
        toAnnounce: [],
        announced: [],
        ongoing: [],
        toAuthorize: [],
        finished: [],
        expired: [],
        loadingState: false
    };

    constructor( private nsfoService:NSFOService ) { }

    public loadToAnnounce(){

    }

    public fetchToAnnounc(){
        this.toAnnounce.next(this._dataStore.toAnnounce);
    }

    public loadAnnounced(){
        this.nsfoService.doGetRequest(this.nsfoService.URI_HEALTH_ANNOUNCED)
            .subscribe(function (res) {
            this._dataStore.announced = res.result;
            this.announced.next(this._dataStore.announced);
        });
    }

    public fetchAnnounced(){
        this.announced.next(this._dataStore.announced);
    }
    

}