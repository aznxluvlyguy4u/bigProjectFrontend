import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {NSFOService} from "../global/services/nsfo/nsfo.service";

@Component({
    directives: [ROUTER_DIRECTIVES],
    templateUrl: '/app/main/main.component.html',
    pipes: [TranslatePipe]
})

export class MainComponent {
    private isActiveSideMenu: boolean = false;
    private isActiveUserMenu: boolean = false;

    constructor(private nsfo: NSFOService, private router: Router) {
        this.validateToken();
    }

    private validateToken() {
        this.nsfo.doGetRequest(this.nsfo.URI_VALIDATE_TOKEN)
            .subscribe(
                res => {},
                err => {this.router.navigate(['/login'])}
            );
    }

    private toggleSideMenu() {
        this.isActiveSideMenu = !this.isActiveSideMenu;
    }

    private toggleUserMenu() {
        this.isActiveUserMenu = !this.isActiveUserMenu;
    }

    private closeAllMenus() {
        this.isActiveSideMenu = false;
        this.isActiveUserMenu = false;
    }

    private logout() {}
}
