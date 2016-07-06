import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Router, ActivatedRoute} from "@angular/router";
import {Subscription} from "rxjs/Rx";

@Component({
    templateUrl: '/app/main/client/dossier/client.create.html',
    pipes: [TranslatePipe]
})

export class ClientDossierComponent {
    private pageTitle: string;
    private pageMode: string;
    private clientId: string;
    private dataSub: Subscription;

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.dataSub = this.activatedRoute.params.subscribe(params => {
            this.pageMode = params['mode'];

            if(this.pageMode == 'edit') {
                this.pageTitle = 'EDIT CLIENT';
                this.clientId = params['id'];
            }

            if(this.pageMode == 'new') {
                this.pageTitle = 'NEW CLIENT';
            }
        })
    }

    ngOnDestroy() {
        this.dataSub.unsubscribe()
    }

    private navigateTo(url: string) {
        this.router.navigate([url]);
    }
}
