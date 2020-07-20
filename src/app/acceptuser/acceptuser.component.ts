import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {NSFOService} from "../global/services/nsfo/nsfo.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from "@angular/router";
import { SpinnerComponent } from '../global/components/spinner/spinner.component';

@Component({
    directives: [SpinnerComponent],
    template: require('./acceptuser.component.html'),
    pipes: [TranslatePipe]
})

export class AcceptUserComponent {

    private onDestroy$: Subject<void> = new Subject<void>();

    private registrationID;

    public acceptedPerson: any;
    public error = null;

    private isLoading = true;

    constructor(
        private nsfo: NSFOService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.registrationID = this.route.snapshot.params.registrationID;
        this.doAcceptUser();
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private doAcceptUser() {
        this.nsfo.doGetRequest(`/v1/auth/registration/${this.registrationID}/process`)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
                res => {
                    this.acceptedPerson = res;
                    this.isLoading = false;
                },
                error => {
                    this.error = this.nsfo.getErrorMessage(error);
                    this.isLoading = false;
                }
            );
    }
}
