import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";

@Injectable()
export class NSFOService {
    // private API_SERVER_URL: string = 'https://nsfo-api.jongensvantechniek.nl/api';
    // private USER_ENV_URL: string = 'http://online.nsfo.nl';

    // private API_SERVER_URL: string = 'http://nsfo-dev-api.jongensvantechniek.nl/api';
    // private USER_ENV_URL: string = 'http://nsfo-dev.jongensvantechniek.nl';

    private API_SERVER_URL: string = 'http://localhost:8000/api';
    private USER_ENV_URL: string = 'http://localhost:8080';

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

    public URI_HEALTH_INSPECTIONS: string = '/v1/health_inspections';
    
    public URI_HEALTH_LOCATION_LETTERS: string = '/v1/health_location_letters';

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

    public doPutRequest(uri:string, data) {
        let headers = new Headers();
        headers.append(this.content_type, "application/json");
        headers.append(this.access_token, localStorage[this.ACCESS_TOKEN_NAMESPACE]);

        return this.http.put(this.API_SERVER_URL + uri, JSON.stringify(data), {headers: headers})
            .map(res => res.json());
    }

    public getUserEnvURL(): string {
        return this.USER_ENV_URL;
    }

    // TODO REMOVE THIS WHEN API LIVE
    doGetUserDetails() {
        return this.http.get("/api/user_details.json")
            .map(res => res.json())
    }

    // TODO REMOVE THIS WHEN API LIVE
    doGetClientInfo() {
        return this.http.get("/api/clients_edit_1.json")
            .map(res => res.json())
    }

    // TODO REMOVE THIS WHEN API LIVE
    doGetClients() {
        return this.http.get("/api/clients.json")
            .map(res => res.json())
    }

    // TODO REMOVE THIS WHEN API LIVE
    doGetProvinces() {
        return this.http.get("/api/provinces.json")
            .map(res => res.json())
    }

    // TODO REMOVE THIS WHEN API LIVE
    doGetHealthStatusses() {
        return this.http.get("/api/health_statusses.json")
            .map(res => res.json())
    }

    // TODO REMOVE THIS WHEN API LIVE
    doGetUsers() {
        return this.http.get("/api/users.json")
            .map(res => res.json())
    }

    // TODO REMOVE THIS WHEN API LIVE
    doGetClientDetails() {
        return this.http.get("/api/clients_details_1.json")
            .map(res => res.json())
    }

    // TODO REMOVE THIS WHEN API LIVE
    doGetClientNotes() {
        return this.http.get("/api/clients_details_1_notes.json")
            .map(res => res.json())
    }

    // TODO REMOVE THIS WHEN API LIVE
    doGetAnimalHealth() {
        return this.http.get("/api/animal_health.json")
            .map(res => res.json())
    }

    // TODO REMOVE THIS WHEN API LIVE
    doGetInvoices() {
        return this.http.get("/api/invoices.json")
            .map(res => res.json())
    }

    // TODO REMOVE THIS WHEN API LIVE
    doGetInvoiceRules() {
        return this.http.get("/api/invoices_rules.json")
            .map(res => res.json())
    }
}