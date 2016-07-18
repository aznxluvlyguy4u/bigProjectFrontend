import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";

@Injectable()
export class NSFOService {
    // private API_SERVER_URL: string = 'http://nsfo-api.jongensvantechniek.nl/api';
    private API_SERVER_URL: string = 'http://ebe6a43d.ngrok.io/api';
    private USER_ENV_URL: string = 'http://localhost:3002';

    private content_type: string = "Content-Type";
    private authorization: string = "Authorization";
    private access_token: string = "AccessToken";
    
    private ACCESS_TOKEN_NAMESPACE: string = 'access_token';
    
    constructor(private http:Http) {}

    public doLoginRequest(username:string, password:string) {
        let headers = new Headers();
        headers.append(this.content_type, "application/json");
        headers.append(this.authorization, 'Basic ' + btoa(username + ':' + password));

        return this.http.get(this.API_SERVER_URL + '/v1/auth/authorize', {headers: headers})
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
}