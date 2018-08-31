import {Injectable} from "@angular/core";
import {NSFOService} from "../nsfo/nsfo.service";
import {ReplaySubject} from "rxjs/Rx";
import { User } from '../../../main/client/client.model';
import { GENDER_TYPES } from '../../constants/gender-type.contant';

@Injectable()
export class UtilsService {
    private provinces: ReplaySubject<any> = new ReplaySubject();
    private adminDetails: ReplaySubject<any> = new ReplaySubject();
    isDeveloper = false;

    constructor(private nsfo: NSFOService) {
        this.initAdminDetails();
        this.initProvinces();
    }

    // USER DETAILS
    public initAdminDetails() {
        this.nsfo.doGetRequest(this.nsfo.URI_MENUBAR)
            .subscribe(res => {
                this.setAdminDetails(res.result);
                this.isDeveloper = res.result.access_level === 'DEVELOPER';
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

    static getPersonType(user: User): string {
			switch(user.type) {
				case 'Client': return 'Gebruiker';
				case 'Employee': return 'Admin';
				case 'VwaEmployee ': return 'VWA-medewerker';
				case 'Inspector ': return 'Inspecteur';
				default: return user.type;
			}
    }

    static getAnimalTypeFromGender(gender: string): string {
        switch (gender) {
          case 'MALE': return 'Ram';
          case 'FEMALE': return 'Ewe';
          case 'NEUTER': return 'Neuter';
          default: return 'Neuter';
        }
    }

    static getBoolValAsString(boolval: boolean) {
        if (typeof boolval === 'boolean') {
            return boolval ? 'true' : 'false';
        }

        return boolval;
    }

    static countDecimals(value) {
        if(value == null || Math.floor(value) === value) return 0;
        return value.toString().split(".")[1].length || 0;
    }

    static getCountryCodeFromCountryName(countryName: string, nullFiller: string = ''): string {
        switch (countryName) {
					case 'Austria': return 'AT';
					case 'Belgium': return 'BE';
					case 'Bulgaria': return 'BG';
					case 'Cyprus': return 'CY';
					case 'Czech Republic': return 'CZ';
					case 'Denmark': return 'DK';
					case 'Estland': return 'EE';
					case 'Finland': return 'FI';
					case 'France': return 'FR';
					case 'Germany': return 'DE';
					case 'Greece': return 'EL';
					case 'Hungary': return 'HU';
					case 'Ireland': return 'IE';
					case 'Italy': return 'IT';
					case 'Latvia': return 'LV';
					case 'Lithuania': return 'LT';
					case 'Luxembourg': return 'LU';
					case 'Netherlands': return 'NL';
					case 'Poland': return 'PL';
					case 'Portugal': return 'PT';
					case 'Romania': return 'RO';
					case 'Slovakia': return 'SK';
					case 'Slovenia': return 'SI';
					case 'Spain': return 'ES';
					case 'Sweden': return 'SE';
					case 'United Kingdom': return 'UK';
          default: return nullFiller;
        }
    }
}