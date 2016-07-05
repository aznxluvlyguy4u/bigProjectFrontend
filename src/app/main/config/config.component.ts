import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";

@Component({
    directives: [ROUTER_DIRECTIVES],
    template: '<h1>CONFIG</h1><router-outlet></router-outlet>'
})

export class ConfigComponent {}
