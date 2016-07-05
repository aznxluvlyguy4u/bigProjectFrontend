import {bootstrap} from "@angular/platform-browser-dynamic";
import {IndexComponent} from "./index.component";
import {APP_ROUTER_PROVIDERS} from "./index.routes";
import {SettingsService} from "./global/settings/settings.service";
import {TranslateService, TranslateLoader, TranslateStaticLoader} from "ng2-translate/ng2-translate";
import {Http, HTTP_PROVIDERS} from "@angular/http";

bootstrap(IndexComponent, [
    APP_ROUTER_PROVIDERS,
    HTTP_PROVIDERS,
    {
        provide: TranslateLoader,
        useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
        deps: [Http]
    },
    TranslateService,
    SettingsService,
]);