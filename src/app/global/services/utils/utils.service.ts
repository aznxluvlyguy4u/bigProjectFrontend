import {Injectable} from "@angular/core";
import {NSFOService} from "../nsfo/nsfo.service";
import {ReplaySubject} from "rxjs/Rx";

@Injectable()
export class UtilsService {
    private provinces: ReplaySubject<any> = new ReplaySubject();
    private healthStatusses: ReplaySubject<any> = new ReplaySubject();

    constructor(private api: NSFOService){
        this.initProvinces();
        this.initHealthStatusses();
    }

    // PROVINCES
    private initProvinces() {
        this.api.doGetProvinces()
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
        this.api.doGetHealthStatusses()
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