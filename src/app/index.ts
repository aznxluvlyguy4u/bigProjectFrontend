import {bootstrap} from "@angular/platform-browser-dynamic";
import {IndexComponent} from "./index.component";
import {APP_ROUTER_PROVIDERS} from "./index.routes";
import {TranslateLoader, TranslateService, TranslateStaticLoader} from "ng2-translate/ng2-translate";
import {Http, HTTP_PROVIDERS} from "@angular/http";
import {SettingsService} from "./global/services/settings/settings.service";
import {NSFOService} from "./global/services/nsfo/nsfo.service";
import {provideForms} from "@angular/forms";
import {UtilsService} from "./global/services/utils/utils.service";
import {AuthenticatedGuard} from "./global/guards/authenticated.guard";
import { DeveloperGuard } from './global/guards/developer.guard';
import { LocationStorage } from './global/services/storage/LocationStorage';

require('font-awesome-loader');

bootstrap(IndexComponent, [
    APP_ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    {
        provide: TranslateLoader,
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
    },
    provideForms(),
    AuthenticatedGuard,
    DeveloperGuard,
    LocationStorage,
    NSFOService,
    TranslateService,
    SettingsService,
    UtilsService
]);