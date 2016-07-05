import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";

@Component({
    directives: [ROUTER_DIRECTIVES],
    templateUrl: '/app/main/client/client.component.html',
    pipes: [TranslatePipe]
})

export class ClientComponent {}

