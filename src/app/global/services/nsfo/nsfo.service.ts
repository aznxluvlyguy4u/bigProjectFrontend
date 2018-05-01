import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { QueryParam } from '../../../main/client/client.model';

import _ = require("lodash");
import { TranslateService } from 'ng2-translate';
import { Country } from '../../models/country.model';
import { Animal } from '../../components/livestock/livestock.model';

import { Country } from '../../models/country.model';
import { Animal } from '../../components/livestock/livestock.model';

@Injectable()
export class NSFOService {
    private API_SERVER_URL: string = NSFO_API_SERVER_URL;
    private USER_ENV_URL: string = NSFO_USER_ENV_URL;

    public URI_RESET_PASSWORD = '/v1/admins/auth/password-reset';
    public URI_VALIDATE_TOKEN = '/v1/auth/validate-token';
    public URI_PROVINCES = '/v1/countries/nl/provinces';

    public URI_ANIMALS = '/v1/animals';
    public URI_ANIMALS_DETAILS = '/v1/animals-details';
    public URI_GET_COLLAR_COLORS = '/v1/collars';

    public URI_GHOST_LOGIN: string = '/v1/admins/ghost';
    public URI_ADMIN: string = '/v1/admins';
    public URI_ADMIN_DEACTIVATE: string = '/v1/admins-deactivate';
    public URI_ADMIN_ACCESS_LEVEL: string = '/v1/admins-access-levels';
    public URI_ADMIN_PROFILE: string = '/v1/profiles-admin';
    public URI_INVOICE = '/v1/invoices';
    public URI_INVOICE_RULE = '/v1/invoice-rules';
    public URI_INVOICE_SENDER_DETAILS = '/v1/invoice-sender-details';
		public URI_LEDGER_CATEGORIES = '/v1/ledger-categories';

	  public URI_GET_COUNTRY_CODES = '/v1/countries?continent=europe';
    public URI_CMS: string = '/v1/cms';
    public URI_DASHBOARD: string = '/v1/admin/dashboard';
    public URI_MENUBAR: string = '/v1/components/admin-menu-bar';

    public URI_CLIENTS: string = '/v1/companies';

    public URI_COMPANIES_INVOICE: string = '/v1/companies/invoice/info';

    public URI_HEALTH_COMPANY: string = '/v1/health/company';
    public URI_HEALTH_UBN: string = '/v1/health/ubn';
    public URI_HEALTH_INSPECTIONS: string = '/v1/inspections';
    public URI_HEALTH_LOCATION_LETTERS: string = '/v1/health_location_letters';

    public URI_LIVESTOCK: string = '/v1/animals-livestock';
    public URI_SETTINGS: string = '/v1/settings';
    public URI_LAB_RESULTS: string = '/v1/lab-results';

    public URI_UBNS: string = 'v1/ubns';

    public URI_LOCATIONS_TO_ANNOUNCE:string = '/v1/ubns?inspectionStatus=to_announce';
    public URI_LOCATIONS_ANNOUNCED:string = '/v1/ubns?inspectionStatus=announced';
    public URI_INSPECTIONS_TO_RECEIVE_LAB_RESULTS:string = '/v1/inspections?status=to_receive_lab_results';
    public URI_INSPECTIONS_TO_AUTHORIZE:string = '/v1/inspections?status=to_authorize';
    public URI_INSPECTIONS_FINISHED:string = '/v1/inspections?status=finished';
    public URI_INSPECTIONS_EXPIRED:string = '/v1/inspections?status=expired';

    public URI_ANNOUNCEMENTS = '/v1/announcements';
    public URI_INSPECTIONS = '/v1/inspections';

    public URI_ANNOUNCEMENTS_LETTERS = '/v1/announcements/letters';
    public URI_INSPECTIONS_LETTERS = '/v1/inspections/letters';
    public URI_BARCODES = '/v1/lab-results/barcodes';

    public URI_ERRORS: string = '/v1/errors';
    public URI_ERRORS_DECLARE_TYPES: string = '/v1/errors-declare-types';
    public URI_ERRORS_HIDDEN_STATUS: string = '/v1/errors-hidden-status';
    public URI_ERRORS_NON_IR: string = '/v1/errors/non-ir';

	  public URI_TECHNICAL_LOG = '/v1/log/action';

	  public URI_PEDIGREE_REGISTERS = '/v1/pedigreeregisters';

		//REPORT
		public URI_GET_LINEAGE_PROOF = '/v1/reports/pedigree-certificates';
		public URI_GET_INBREEDING_COEFFICIENT = '/v1/reports/inbreeding-coefficients';
		public URI_GET_LIVESTOCK_DOCUMENT = '/v1/reports/livestock';
		public URI_GET_OFFSPRING = '/v1/reports/offspring';
		public URI_GET_ANIMALS_OVERVIEW_REPORT = '/v1/reports/animals-overview';
		public URI_GET_ANNUAL_TE100_UBN_PRODUCTION_REPORT = '/v1/reports/annual-te100-ubn-production';

	  public URI_TREATMENTS = '/v1/treatments';
	  public URI_TREATMENT_TYPES = '/v1/treatment-types';

    public URI_VWA_EMPLOYEE: string = '/v1/vwa-employee';

    private content_type: string = "Content-Type";
    private authorization: string = "Authorization";
    public access_token: string = "AccessToken";

    private ACCESS_TOKEN_NAMESPACE: string = 'access_token';

		countryCodeList: Country[] = [];
		countries: Country[] = [];

    constructor(private http:Http, private translate: TranslateService) {
				this.doGetCountryCodeList(); // if in OnInit it is loaded too late
		}

		private doGetCountryCodeList() {
			this.doGetRequest(this.URI_GET_COUNTRY_CODES)
				.subscribe(
					res => {
						this.countryCodeList = _.sortBy(res.result, ['code']);
						this.countries = _.sortBy(res.result, ['name']);
					},
					error => {
						alert(this.getErrorMessage(error));
					}
				);
		}

    public doLoginRequest(username:string, password:string) {
        let headers = new Headers();
        headers.append(this.content_type, "application/json");
        headers.append(this.authorization, 'Basic ' + btoa(username + ':' + password));

        return this.http.get(this.API_SERVER_URL + '/v1/admins/auth/authorize', {headers: headers})
            .map(res => res.json());
    }

	  getHeadersWithToken() {
			let headers = new Headers();
			headers.append(this.content_type, "application/json");
			headers.append(this.access_token, localStorage[this.ACCESS_TOKEN_NAMESPACE]);
			return headers;
	  }

    public doPostRequest(uri:string, data) {
        return this.http.post(this.API_SERVER_URL + uri, JSON.stringify(data), {headers: this.getHeadersWithToken()})
            .map(res => res.json());
    }

    public doGetRequest(uri:string) {
        return this.http.get(this.API_SERVER_URL + uri, {headers: this.getHeadersWithToken()})
            .map(res => res.json());
    }

    public doGetLabResultsRequest(inspectionId:string, ubn:string) {
        let headers = new Headers();
        headers.append(this.content_type, "application/json");
        headers.append(this.access_token, localStorage[this.ACCESS_TOKEN_NAMESPACE]);
        headers.append('inspectionId', inspectionId);
        headers.append('ubn', ubn);

        return this.http.get(this.API_SERVER_URL + this.URI_LAB_RESULTS, {headers: headers})
            .map(res => res.json());
    }

    public doGetMockRequest(uri:string) {
        let headers = new Headers();
        headers.append(this.content_type, "application/json");
        headers.append(this.access_token, localStorage[this.ACCESS_TOKEN_NAMESPACE]);

        return this.http.get(uri, {headers: headers})
            .map(res => res.json());
    }

    public doPutRequest(uri:string, data) {
        return this.http.put(this.API_SERVER_URL + uri, JSON.stringify(data), {headers: this.getHeadersWithToken()})
            .map(res => res.json());
    }

    public doDeleteRequest(uri:string, data) {
        return this.http.delete(this.API_SERVER_URL + uri, {headers: this.getHeadersWithToken()})
            .map(res => res.json());
    }

    public doPatchRequest(uri:string, data) {
        return this.http.patch(this.API_SERVER_URL + uri, data, {headers: this.getHeadersWithToken()})
          .map(res => res.json());
    }

    public getUserEnvURL(): string {
        return this.USER_ENV_URL;
    }

    public parseQueryParamsString(queryParams: QueryParam[]): string {
        if (queryParams.length === 0) { return ''; }

			  let queryString =  '?';
        let prefix = '';
        for(let queryParam of queryParams) {
            queryString = queryString + prefix + queryParam.key + '=' + queryParam.value;
					  prefix = '&';
        }
        return queryString;
    }

    public getErrorMessage(err: Response): string {
			switch (err.status) {
				case 500: return this.translate.instant("SOMETHING WENT WRONG. TRY ANOTHER TIME.");
				case 524: return this.translate.instant("A TIMEOUT OCCURED. TRY AGAIN LATER, PERHAPS WHEN THE SERVER IS LESS BUSY OR TRY IT WITH LESS DATA.");

				default:
					if (err.json() && err.json().result && err.json().result.message) {
						return this.translate.instant(err.json().result.message);
					}
					return this.translate.instant("SOMETHING WENT WRONG. TRY ANOTHER TIME.");
			}
    }

    static cleanAnimalsInput(animals: Animal[], variables = ['uln_country_code', 'uln_number']): Animal[] {
			return _.map(animals, function (object: Animal) {
				return _.pick(object, variables)
			});
		}
}
