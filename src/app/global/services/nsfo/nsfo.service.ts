import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";

@Injectable()
export class NSFOService {
    private API_SERVER_URL: string = NSFO_API_SERVER_URL;
    private USER_ENV_URL: string = NSFO_USER_ENV_URL;

    public URI_RESET_PASSWORD = '/v1/admins/auth/password-reset';
    public URI_VALIDATE_TOKEN = '/v1/auth/validate-token';
    public URI_PROVINCES = '/v1/countries/nl/provinces';

    public URI_GHOST_LOGIN: string = '/v1/admins/ghost';
    public URI_ADMIN: string = '/v1/admins';
    public URI_ADMIN_DEACTIVATE: string = '/v1/admins-deactivate';
    public URI_ADMIN_ACCESS_LEVEL: string = '/v1/admins-access-levels';
    public URI_ADMIN_PROFILE: string = '/v1/profiles-admin';

    public URI_CMS: string = '/v1/cms';
    public URI_DASHBOARD: string = '/v1/admin/dashboard';
    public URI_MENUBAR: string = '/v1/components/admin-menu-bar';

    public URI_CLIENTS: string = '/v1/companies';

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

    private content_type: string = "Content-Type";
    private authorization: string = "Authorization";
    public access_token: string = "AccessToken";

    private ACCESS_TOKEN_NAMESPACE: string = 'access_token';

    constructor(private http:Http) {}

    public doLoginRequest(username:string, password:string) {
        let headers = new Headers();
        headers.append(this.content_type, "application/json");
        headers.append(this.authorization, 'Basic ' + btoa(username + ':' + password));

        return this.http.get(this.API_SERVER_URL + '/v1/admins/auth/authorize', {headers: headers})
            .map(res => res.json());
    }

    public doPostRequest(uri:string, data) {
        let headers = new Headers();
        headers.append(this.content_type, "application/json");
        headers.append(this.access_token, localStorage[this.ACCESS_TOKEN_NAMESPACE]);

        return this.http.post(this.API_SERVER_URL + uri, JSON.stringify(data), {headers: headers})
            .map(res => res.json());
    }

    public doGetRequest(uri:string) {
        let headers = new Headers();
        headers.append(this.content_type, "application/json");
        headers.append(this.access_token, localStorage[this.ACCESS_TOKEN_NAMESPACE]);

        return this.http.get(this.API_SERVER_URL + uri, {headers: headers})
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
        let headers = new Headers();
        headers.append(this.content_type, "application/json");
        headers.append(this.access_token, localStorage[this.ACCESS_TOKEN_NAMESPACE]);

        return this.http.put(this.API_SERVER_URL + uri, JSON.stringify(data), {headers: headers})
            .map(res => res.json());
    }

    public doDeleteRequest(uri:string, data) {
        let headers = new Headers();
        headers.append(this.content_type, "application/json");
        headers.append(this.access_token, localStorage[this.ACCESS_TOKEN_NAMESPACE]);

        return this.http.delete(this.API_SERVER_URL + uri, {headers: headers})
            .map(res => res.json());
    }

    public getUserEnvURL(): string {
        return this.USER_ENV_URL;
    }
}
