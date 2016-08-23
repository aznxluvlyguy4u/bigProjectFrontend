import {Component, Input, Output} from "@angular/core";
import {EventEmitter} from "@angular/platform-browser-dynamic/src/facade/async";
import {TranslatePipe} from "ng2-translate/ng2-translate";

@Component({
    selector: 'request-auth',
    template: require('./tableAuthorization.authorization.html'),
    pipes: [TranslatePipe]
})

export class AuthorizationComponent {
    
    @Input() requestId: string;
    @Output() showOverviewPage: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor() {}

    private goToOverviewPage() {
        this.showOverviewPage.emit(false);
    }
}
