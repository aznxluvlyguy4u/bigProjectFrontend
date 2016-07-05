import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";

@Injectable()
export class NSFOService {
    private API_SERVER_URL: string = 'http://nsfo-api.jongensvantechniek.nl/api';
    
    private content_type: string = "Content-Type";
    private authorization: string = "Authorization";
    private access_token: string = "AccessToken";
    
    private ACCESS_TOKEN_NAMESPACE: string = 'access_token';
    
    constructor(private http:Http) {}

    doLoginRequest(username:string, password:string) {
        let headers = new Headers();
        headers.append(this.content_type, "application/json");
        headers.append(this.authorization, 'Basic ' + btoa(username + ':' + password));

        return this.http.get(this.API_SERVER_URL + '/v1/auth/authorize', {headers: headers})
            .map(res => res.json());
    }

    doPostRequest(uri:string, data) {
        let headers = new Headers();
        headers.append(this.content_type, "application/json");
        headers.append(this.access_token, localStorage[this.ACCESS_TOKEN_NAMESPACE]);

        return this.http.post(this.API_SERVER_URL + uri, JSON.stringify(data), {headers: headers})
            .map(res => res.json());
    }

    doGetRequest(uri:string) {
        let headers = new Headers();
        headers.append(this.content_type, "application/json");
        headers.append(this.access_token, localStorage[this.ACCESS_TOKEN_NAMESPACE]);

        return this.http.get(this.API_SERVER_URL + uri, {headers: headers})
            .map(res => res.json());
    }

    doPutRequest(uri:string, data) {
        let headers = new Headers();
        headers.append(this.content_type, "application/json");
        headers.append(this.access_token, localStorage[this.ACCESS_TOKEN_NAMESPACE]);

        return this.http.put(this.API_SERVER_URL + uri, JSON.stringify(data), {headers: headers})
            .map(res => res.json());
    }

    // TODO REMOVE THIS WHEN API LIVE
    doGetClients() {
        return this.http.get("/api/clients.json")
            .map(res => res.json())
    }
}