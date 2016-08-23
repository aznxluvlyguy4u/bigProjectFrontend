import moment = require("moment");
import {Component, ViewEncapsulation} from "@angular/core";
import {TranslateService} from "ng2-translate/ng2-translate";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {SettingsService} from "./global/services/settings/settings.service";

@Component({
    selector: 'nsfo-admin',
    directives: [ROUTER_DIRECTIVES],
    encapsulation: ViewEncapsulation.None,
    styles: [
        require('../../node_modules/foundation-sites/dist/foundation.min.css'),
        require('../assets/sass/main.sass')
    ],
    template: '<router-outlet></router-outlet>',
})

export class IndexComponent {

    constructor(private translate:TranslateService, private settings:SettingsService) {
        translate.setDefaultLang(this.settings.getLanguage());
        translate.use(this.settings.getLanguage());
        moment.locale(this.settings.getLocale());
    }
}