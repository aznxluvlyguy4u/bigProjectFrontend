import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {NSFOService} from "../global/services/nsfo/nsfo.service";
import {Observable} from "rxjs/Rx";
import {Admin} from "./main.model";
import {UtilsService} from "../global/services/utils/utils.service";

@Component({
    directives: [ROUTER_DIRECTIVES],
    template: require('./main.component.html'),
    pipes: [TranslatePipe]
})

export class MainComponent {
    private isActiveSideMenu: boolean = false;
    private isActiveUserMenu: boolean = false;
    private admin: Admin = new Admin();
    private adminDetails$: Observable;

    constructor(private nsfo: NSFOService, private router: Router, private utils: UtilsService) {
        this.getAdminDetails();
        this.validateToken();
    }

    private validateToken() {
        this.nsfo.doGetRequest(this.nsfo.URI_VALIDATE_TOKEN)
            .subscribe(
                res => {},
                err => {this.router.navigate(['/login'])}
            );
    }
    
    private getAdminDetails() {
        this.adminDetails$ = this.utils.getAdminDetails()
            .subscribe(
                res => {
                    this.admin.first_name = res.first_name;
                    this.admin.last_name = res.last_name;
                });
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

    private logout() {
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
    }
}
