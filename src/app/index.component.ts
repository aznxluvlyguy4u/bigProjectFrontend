import {Component} from "@angular/core";
import {TranslateService} from "ng2-translate/ng2-translate";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {SettingsService} from "./global/settings/settings.service";
import moment from 'moment';

@Component({
    selector: 'nsfo-admin',
    directives: [ROUTER_DIRECTIVES],
    template: '<router-outlet></router-outlet>',
})

export class IndexComponent {

    constructor(private translate:TranslateService, private settings:SettingsService) {
        translate.setDefaultLang(this.settings.getLanguage());
        translate.use(this.settings.getLanguage());
        moment.locale(this.settings.getLocale());
    }
}