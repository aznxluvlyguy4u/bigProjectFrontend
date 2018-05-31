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
import {InvoiceBatchComponent} from "./main/invoice/batch/invoice.batch";
import {ConfigComponent} from "./main/config/config.component";
import {ConfigCMSComponent} from "./main/config/cms/cms.component";
import {ProfileComponent} from "./main/profile/profile.component";
import {LoginComponent} from "./login/login.component";
import {ConfigChoiceFieldsComponent} from "./main/config/choiceFields/config.choiceFields";
import {InvoiceOverviewComponent} from "./main/invoice/overview/invoice.overview";
import {AuthenticatedGuard} from "./global/guards/authenticated.guard";
import {ConfigAdminsComponent} from "./main/config/admins/config.admins";
import {ReportComponent} from "./main/report/report.component";
import {GhostLoginComponent} from "./ghostlogin/ghostlogin.component";
import {HealthLettersComponent} from "./main/config/healthLetters/healthLetters.component";
import {ScrapieAnnouncementComponent} from "./main/config/healthLetters/scrapie/announcement/scrapie.announcement";
import {ScrapieSupportComponent} from "./main/config/healthLetters/scrapie/support/scrapie.support";
import {LoadingComponent} from "./loading/loading.component";
import {ConfigInvoicesComponent} from "./main/config/invoices/invoices.component";
import {InvoicesRuleTemplatesComponent} from "./main/config/invoices/rules/standardInvoiceRules.invoices";
import {InvoicesNSFODetailsComponent} from "./main/config/invoices/details/details.invoices";
import {MaediVisnaAnnouncementComponent} from "./main/config/healthLetters/maediVisna/announcement/maediVisna.announcement";
import {MaediVisnaSupportComponent} from "./main/config/healthLetters/maediVisna/support/maediVisna.support";
import {ConfigVwaEmployeesComponent} from "./main/config/vwa-employees/config.vwa-employees";
import { TechnicalLogOverviewComponent } from './main/technicalLog/technical-log-overview.component';
import { TreatmentMainComponent } from './main/treatment/treatment-main.component';
import { TreatmentTemplateComponent } from './main/treatment/treatment-template/treatment-template.component';
import { TreatmentTypeComponent } from './main/treatment/treatment-type/treatment-type.component';
import { TreatmentPrescriptionComponent } from './main/treatment/treatment-prescription/treatment-prescription.component';
import { ErrorLogOverviewComponent } from './main/errorlog/error-log-overview.component';
import { DeveloperGuard } from './global/guards/developer.guard';
import { AnimalsComponent } from './main/animals/animals.component';
import { AnimalsBatchEditComponent } from './main/animals/animals-batch-edit/animals-batch-edit.component';
import { AnimalReportsComponent } from './main/report/animals-overviews/animal-reports.component';
import { AllAnimalsOverviewComponent } from './main/report/animals-overviews/all-animals-overview/all-animals-overview.component';
import { AnnualTe100ProductionComponent } from './main/report/animals-overviews/annual-te100-production/annual-te100-production.component';
import { MaediVisnaComponent } from './main/health/illnesses/maedivisna/maedi-visna.component';
import { ScrapieComponent } from './main/health/illnesses/scrapie/scrapie.component';
import { HealthInspectionsComponent } from './main/health/illnessbasecomponent/inspections/health.inspections';
import { HealthFailedImportsComponent } from './main/health/illnessbasecomponent/failedImports/health.failedImports';
import { AnnualActiveLivestockComponent } from './main/report/animals-overviews/annual-active-livestock/annual-active-livestock.component';
import { AnnualActiveLivestockRamMatesComponent } from './main/report/animals-overviews/annual-active-livestock-ram-mates/annual-active-livestock-ram-mates.component';

const routes: RouterConfig = [
    {
        path: '', component: MainComponent, canActivate: [AuthenticatedGuard],
        children: [
            {path: '', terminal: true, redirectTo: 'dashboard'},
            {path: 'dashboard', terminal: true, component: DashboardComponent},
            {path: 'health', component: HealthComponent,
                children: [
                		// Make sure these child paths matches the format of the illness type query parameters
                    {path: '', terminal: true, redirectTo: 'maedi_visna'},
                    {path: 'maedi_visna', component: MaediVisnaComponent,
											children: [
												{path: '', terminal: true, redirectTo: 'inspections'},
												{path: 'inspections', component: HealthInspectionsComponent},
												{path: 'failed_imports', component: HealthFailedImportsComponent},
											]},
                    {path: 'scrapie', component: ScrapieComponent,
											children: [
												{path: '', terminal: true, redirectTo: 'inspections'},
												{path: 'inspections', component: HealthInspectionsComponent},
												{path: 'failed_imports', component: HealthFailedImportsComponent},
											]},
                ]},
					// {path: 'health', component: HealthComponent,
					// 	children: [
					// 		{path: '', terminal: true, redirectTo: 'inspections'},
					// 		{path: 'inspections', component: HealthInspectionsComponent},
					// 		{path: 'failed_imports', component: HealthFailedImportsComponent},
					// 	]},
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
                    {path: 'batch', component: InvoiceBatchComponent}
                ]},
            {path: 'configuration', component: ConfigComponent,
                children: [
                    {path: '', terminal: true, redirectTo: 'admins'},
                    {path: 'admins', component: ConfigAdminsComponent},
                    {path: 'third-party-users', component: ConfigVwaEmployeesComponent},
                    {path: 'cms', component: ConfigCMSComponent},
                    {path: 'invoices', component: ConfigInvoicesComponent,
                        children: [
                            {path: '', terminal: true, redirectTo: 'invoices_rule_templates'},
                            {path: 'invoices_rule_templates', component: InvoicesRuleTemplatesComponent},
                            {path: 'invoices_details', component: InvoicesNSFODetailsComponent},
                        ]},
                    {path: 'health_letters', component: HealthLettersComponent,
                        children: [
                            {path: '', terminal: true, redirectTo: 'scrapie_announcement'},
                            {path: 'scrapie_announcement', component: ScrapieAnnouncementComponent},
                            {path: 'scrapie_supporting', component: ScrapieSupportComponent},
                            {path: 'maedi_visna_announcement', component: MaediVisnaAnnouncementComponent},
                            {path: 'maedi_visna_supporting', component: MaediVisnaSupportComponent},
                        ]},
                    {path: 'choice_fields', component: ConfigChoiceFieldsComponent}
                ]},
              // {path: 'animals', component: AnimalsComponent, canActivate: [DeveloperGuard],
              {path: 'animals', component: AnimalsComponent,
                children: [
                  {path: '', terminal: true, redirectTo: 'batch-edit'},
                  {path: 'batch-edit', component: AnimalsBatchEditComponent}
                ]},
            {path: 'report', component: ReportComponent,
                children: [
									{path: '', terminal: true, redirectTo: 'animal-reports'},
									{path: 'animal-reports', component: AnimalReportsComponent,
										children: [
											{path: '', terminal: true, redirectTo: 'all-animals-overview'},
											{path: 'all-animals-overview', component: AllAnimalsOverviewComponent},
											{path: 'annual-te100-production', component: AnnualTe100ProductionComponent},
											{path: 'annual-active-livestock', component: AnnualActiveLivestockComponent},
											{path: 'annual-active-livestock-ram-mates', component: AnnualActiveLivestockRamMatesComponent},
										]},
                ]},
					  {path: 'log', terminal: true, component: TechnicalLogOverviewComponent},
					  {path: 'error-log', terminal: true, component: ErrorLogOverviewComponent},
            {path: 'profile', terminal: true, component: ProfileComponent},
					  // {path: 'treatment', terminal: true, component: TreatmentMainComponent}
					  {path: 'treatment', component: TreatmentMainComponent,
							children: [
								{path: '', terminal: true, redirectTo: 'templates'},
								{path: 'prescriptions', component: TreatmentPrescriptionComponent},
								{path: 'templates', component: TreatmentTemplateComponent},
								{path: 'types', component: TreatmentTypeComponent},
							]},
        ]
    },
    {path: 'ghostlogin/:person', component: GhostLoginComponent, canActivate: [AuthenticatedGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'loading', terminal: true, component: LoadingComponent}
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(routes, {enableTracing: false})
];
