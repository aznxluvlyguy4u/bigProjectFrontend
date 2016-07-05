import {provideRouter, RouterConfig} from "@angular/router";
import {MainComponent} from "./main/main.component";
import {DashboardComponent} from "./main/dashboard/dashboard.component";
import {HealthComponent} from "./main/health/health.component";
import {HealthErroneousCSVComponent} from "./main/health/erroneous-csv/health.erroneousCSV";
import {HealthAddCSVComponent} from "./main/health/add-csv/health.addCSV";
import {HealthAuthorizeComponent} from "./main/health/authorize/health.authorize";
import {HealthLettersComponent} from "./main/health/letters/health.letters";
import {ClientComponent} from "./main/client/client.component";
import {ClientEditComponent} from "./main/client/edit/client.edit";
import {ClientCreateComponent} from "./main/client/create/client.create";
import {ClientDetailsComponent} from "./main/client/details/client.details";
import {ClientLivestockComponent} from "./main/client/livestock/client.livestock";
import {InvoiceCreateComponent} from "./main/invoice/create/invoice.create";
import {InvoiceDetailsConfigComponent} from "./main/invoice/details-config/invoice.detailsConfig";
import {InvoiceDetailsComponent} from "./main/invoice/details/invoice.details";
import {InvoiceRulesComponent} from "./main/invoice/rules/invoice.rules";
import {InvoiceComponent} from "./main/invoice/invoice.component";
import {InvoiceConfigComponent} from "./main/invoice/config/invoice.config";
import {ConfigComponent} from "./main/config/config.component";
import {ConfigLossComponent} from "./main/config/loss/config.loss";
import {ConfigTreatmentComponent} from "./main/config/treatment/config.treatment";
import {ConfigContactComponent} from "./main/config/contact/config.contact";
import {ConfigDepartComponent} from "./main/config/depart/config.depart";
import {CMSComponent} from "./main/cms/cms.component";
import {ProfileComponent} from "./main/profile/profile.component";
import {LoginComponent} from "./login/login.component";

const routes: RouterConfig = [
    {
        path: '', component: MainComponent,
        children: [
            {path: '', terminal: true, redirectTo: 'dashboard'},
            {path: 'dashboard', terminal: true, component: DashboardComponent},
            {path: 'health', component: HealthComponent,
                children: [
                    {path: '', terminal: true, redirectTo: 'erroneous-csv'},
                    {path: 'erroneous-csv', component: HealthErroneousCSVComponent},
                    {path: 'add-csv', component: HealthAddCSVComponent},
                    {path: 'authorize', component: HealthAuthorizeComponent},
                    {path: 'letters', component: HealthLettersComponent}
                ]},
            {path: 'client', component: ClientComponent,
                children: [
                    {path: '', terminal: true, redirectTo: 'edit'},
                    {path: 'edit', component: ClientEditComponent},
                    {path: 'create', component: ClientCreateComponent},
                    {path: 'details', component: ClientDetailsComponent},
                    {path: 'livestock', component: ClientLivestockComponent}
                ]},
            {path: 'invoice', component: InvoiceComponent,
                children: [
                    {path: '', terminal: true, redirectTo: 'configuration'},
                    {path: 'configuration', component: InvoiceConfigComponent},
                    {path: 'create', component: InvoiceCreateComponent},
                    {path: 'details', component: InvoiceDetailsComponent},
                    {path: 'rules', component: InvoiceRulesComponent},
                    {path: 'details-configuration', component: InvoiceDetailsConfigComponent}
                ]},
            {path: 'configuration', component: ConfigComponent,
                children: [
                    {path: '', terminal: true, redirectTo: 'loss'},
                    {path: 'loss', component: ConfigLossComponent},
                    {path: 'treatment', component: ConfigTreatmentComponent},
                    {path: 'contact', component: ConfigContactComponent},
                    {path: 'depart', component: ConfigDepartComponent}
                ]},
            {path: 'cms', terminal: true, component: CMSComponent},
            {path: 'profile', terminal: true, component: ProfileComponent}
        ]
    },
    {path: 'login', component: LoginComponent}
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes, {enableTracing: true})
];
