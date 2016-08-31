import {Injectable} from "@angular/core";
import {NSFOService} from "../nsfo/nsfo.service";
import {ReplaySubject} from "rxjs/Rx";

@Injectable()
export class UtilsService {
    private provinces: ReplaySubject<any> = new ReplaySubject();
    private healthStatusses: ReplaySubject<any> = new ReplaySubject();
    private adminDetails: ReplaySubject<any> = new ReplaySubject();

    constructor(private nsfo: NSFOService) {
        this.initAdminDetails();
        this.initProvinces();
        this.initHealthStatusses();
    }

    // USER DETAILS
    public initAdminDetails() {
        this.nsfo.doGetRequest(this.nsfo.URI_MENUBAR)
            .subscribe(res => {
                this.setAdminDetails(res.result);
            })
    }

    public setAdminDetails(userDetails) {
        this.adminDetails.next(userDetails);
    }

    public getAdminDetails() {
        return this.adminDetails.asObservable();
    }

    // PROVINCES
    private initProvinces() {
        this.nsfo.doGetRequest(this.nsfo.URI_PROVINCES)
            .subscribe(res => {
                this.setProvinces(res.result);
            })
    };

    public setProvinces(provinces) {
        this.provinces.next(provinces);
    }

    public getProvinces() {
        return this.provinces.asObservable();
    }

    // HEALTH STATUSSES
    private initHealthStatusses() {
        this.nsfo.doGetHealthStatusses()
            .subscribe(res => {
                this.setHealthStatusses(res.result);
            })
    }

    public setHealthStatusses(provinces) {
        this.healthStatusses.next(provinces);
    }

    public getHealthStatusses() {
        return this.healthStatusses.asObservable();
    }
}