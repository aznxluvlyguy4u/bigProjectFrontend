import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";

@Component({
    directives: [ROUTER_DIRECTIVES],
    templateUrl: '/app/main/main.component.html',
    pipes: [TranslatePipe]
})

export class MainComponent {
    private isActiveSideMenu: boolean = false;
    private isActiveUserMenu: boolean = false;

    private toggleSideMenu() {
        this.isActiveSideMenu = !this.isActiveSideMenu;
    }

    private toggleUserMenu() {
        this.isActiveUserMenu = !this.isActiveUserMenu;
    }

    private logout() {
        
    }
}
