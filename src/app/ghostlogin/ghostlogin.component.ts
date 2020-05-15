import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, ActivatedRoute} from "@angular/router";
import {NSFOService} from "../global/services/nsfo/nsfo.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    directives: [ROUTER_DIRECTIVES],
    template: require('./ghostlogin.component.html')
})

export class GhostLoginComponent {

    private onDestroy$: Subject<void> = new Subject<void>();

    constructor(private nsfo: NSFOService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
       this.activatedRoute.params
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(params => {
            let personID = params['person'];
            this.loginAsGhost(personID);
        })
    }

    ngOnDestroy() {
        this.onDestroy$.next();
    }

    private loginAsGhost(personID: string) {
        let request = {
            "person_id": personID
        };

        this.nsfo.doPostRequest(this.nsfo.URI_GHOST_LOGIN, request)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
                res => {
                    let ghostToken = res.result.ghost_token;
                    let accessToken = localStorage['access_token'];
                    window.location.href= this.nsfo.getUserEnvURL() + '/ghostlogin/' + ghostToken + '/' + accessToken;
                }
            );
    };
}