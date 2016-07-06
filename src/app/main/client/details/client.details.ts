import {Component} from "@angular/core";
import {Subscription} from "rxjs/Rx";
import {Router, ActivatedRoute} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";

@Component({
    templateUrl: '/app/main/client/details/client.details.html',
    pipes: [TranslatePipe]
})

export class ClientDetailsComponent {
    private dataSub: Subscription;
    private clientId: string;

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.dataSub = this.activatedRoute.params.subscribe(params => {
            this.clientId = params['id'];
        });
    }

    ngOnDestroy() {
        this.dataSub.unsubscribe()
    }


    private navigateTo(url: string) {
        this.router.navigate([url]);
    }
}

