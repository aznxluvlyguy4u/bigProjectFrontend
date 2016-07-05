import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";

@Component({
    directives: [ROUTER_DIRECTIVES],
    template: '<h1>CLIENT</h1><router-outlet></router-outlet>'
})

export class ClientComponent {}

