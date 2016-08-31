import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Rx";
import {NSFOService} from "../global/services/nsfo/nsfo.service";

@Component({
    directives: [ROUTER_DIRECTIVES],
    template: require('./ghostlogin.component.html')
})

export class GhostLoginComponent {
    private dataSub: Subscription;

    constructor(private nsfo: NSFOService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.dataSub = this.activatedRoute.params.subscribe(params => {
            let personID = params['person'];
            this.loginAsGhost(personID);
        })
    }

    ngOnDestroy() {
        this.dataSub.unsubscribe();
    }

    private loginAsGhost(personID: string) {
        let request = {
            "person_id": personID
        };

        this.nsfo.doPostRequest(this.nsfo.URI_GHOST_LOGIN, request)
            .subscribe(
                res => {
                    let ghostToken = res.result.ghost_token;
                    let accessToken = localStorage['access_token'];
                    window.location.href= this.nsfo.getUserEnvURL() + '/ghostlogin/' + ghostToken + '/' + accessToken;
                }
            );
    };
}