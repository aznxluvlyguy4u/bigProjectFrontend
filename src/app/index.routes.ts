import {provideRouter, RouterConfig} from "@angular/router";
import {MainComponent} from "./main/main.component";
import {DashboardComponent} from "./main/dashboard/dashboard.component";
import {HealthComponent} from "./main/health/health.component";
import {ClientComponent} from "./main/client/client.component";
import {ClientOverviewComponent} from "./main/client/overview/client.overview";
import {ClientDossierComponent} from "./main/client/dossier/client.dossier";
import {ClientDetailsComponent} from "./main/client/details/client.details";
import {InvoiceDetailsComponent} from "./main/invoice/details/invoice.details";
import {InvoiceComponent} from "./main/invoice/invoice.component";
import {ConfigComponent} from "./main/config/config.component";
import {ConfigCMSComponent} from "./main/config/cms/cms.component";
import {ProfileComponent} from "./main/profile/profile.component";
import {LoginComponent} from "./login/login.component";
import {ConfigChoiceFieldsComponent} from "./main/config/choiceFields/config.choiceFields";
import {HealthInspectionsComponent} from "./main/health/inspections/health.inspections";
import {HealthFailedImportsComponent} from "./main/health/failedImports/health.failedImports";
import {InvoiceOverviewComponent} from "./main/invoice/overview/invoice.overview";
import {AuthenticatedGuard} from "./global/guards/authenticated.guard";
import {ConfigAdminsComponent} from "./main/config/admins/config.admins";
import {ReportComponent} from "./main/report/report.component";
import {GhostLoginComponent} from "./ghostlogin/ghostlogin.component";
import {HealthLettersComponent} from "./main/config/healthLetters/healthLetters.component";
import {ScrapieAnnouncementComponent} from "./main/config/healthLetters/scrapie/announcement/scrapie.announcement";
import {ScrapieSupportComponent} from "./main/config/healthLetters/scrapie/support/scrapie.support";
import {LoadingComponent} from "./loading/loading.component";

const routes: RouterConfig = [
    {
        path: '', component: MainComponent, canActivate: [AuthenticatedGuard],
        children: [
            {path: '', terminal: true, redirectTo: 'dashboard'},
            {path: 'dashboard', terminal: true, component: DashboardComponent},
            {path: 'health', component: HealthComponent,
                children: [
                    {path: '', terminal: true, redirectTo: 'inspections'},
                    {path: 'inspections', component: HealthInspectionsComponent},
                    {path: 'failed_imports', component: HealthFailedImportsComponent},
                ]},
            {path: 'client', component: ClientComponent,
                children: [
                    {path: '', terminal: true, redirectTo: 'overview'},
                    {path: 'overview', component: ClientOverviewComponent},
                    {path: 'dossier/:mode', component: ClientDossierComponent},
                    {path: 'dossier/:mode/:id', component: ClientDossierComponent},
                    {path: 'details/:id', component: ClientDetailsComponent}
                ]},
            {path: 'invoice', component: InvoiceComponent,
                children: [
                    {path: '', terminal: true, redirectTo: 'overview'},
                    {path: 'overview', component: InvoiceOverviewComponent},
                    {path: 'details/:mode', component: InvoiceDetailsComponent},
                    {path: 'details/:mode/:id', component: InvoiceDetailsComponent},
                ]},
            {path: 'configuration', component: ConfigComponent,
                children: [
                    {path: '', terminal: true, redirectTo: 'admins'},
                    {path: 'admins', component: ConfigAdminsComponent},
                    {path: 'cms', component: ConfigCMSComponent},
                    {path: 'health_letters', component: HealthLettersComponent,
                        children: [
                            {path: '', terminal: true, redirectTo: 'scrapie_announcement'},
                            {path: 'scrapie_announcement', component: ScrapieAnnouncementComponent},
                            {path: 'scrapie_supporting', component: ScrapieSupportComponent},
                        ]},
                    {path: 'choice_fields', component: ConfigChoiceFieldsComponent}
                ]},
            {path: 'report', terminal: true, component: ReportComponent},
            {path: 'profile', terminal: true, component: ProfileComponent}
        ]
    },
    {path: 'ghostlogin/:person', component: GhostLoginComponent, canActivate: [AuthenticatedGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'loading', terminal: true, component: LoadingComponent}
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes, {enableTracing: false})
];
