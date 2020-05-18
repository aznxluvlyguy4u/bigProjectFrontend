import _ = require("lodash");
import {Component, Input, Output} from "@angular/core";
import {EventEmitter} from "@angular/platform-browser-dynamic/src/facade/async";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {SettingsService} from "../../../../../../global/services/settings/settings.service";
import {Datepicker} from "../../../../../../global/components/datepicker/datepicker.component";
import {REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {ControlGroup, FormBuilder} from "@angular/common";
import {AnimalHealthRequest} from "../../../../health.model";
import {NSFOService} from "../../../../../../global/services/nsfo/nsfo.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'request-auth',
    directives: [REACTIVE_FORM_DIRECTIVES, Datepicker],
    template: require('./tableAuthorization.authorization.html'),
    pipes: [TranslatePipe]
})

export class AuthorizationComponent {
    private form: ControlGroup;
    private savingInProgress: boolean;
    private isLoading: boolean = true;
    private foundHealthStatusSuggestion: boolean;
    private currentHealthStatus: string;
    private requiredCount: number;
    private suggestedHealthStatus: string;

    @Input() results = [];
    @Input() request: AnimalHealthRequest = new AnimalHealthRequest();
    @Output() showOverviewPage: EventEmitter<boolean> = new EventEmitter<boolean>();

    private onDestroy$: Subject<void> = new Subject<void>();

    constructor(private settings: SettingsService, private fb: FormBuilder, private nsfo: NSFOService) {
        this.form = fb.group({
            health_status: [''],
            date_since: [''],
            date_till: [''],
        })
    }

    ngOnDestroy() {
        this.onDestroy$.next();
    }

    ngOnChanges() {
        if(this.results) {
            this.getRequiredResultCount();
        }
    }

    private getCurrentHealthStatus(): void {
        this.nsfo.doGetRequest(this.nsfo.URI_HEALTH_UBN + '/' + this.request.ubn)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
                res => {
                    let location = res.result;
                    let illness = this.request.inspection;

                    if (illness == 'SCRAPIE') {
                        this.currentHealthStatus = location.scrapie_status.replace(/-/g, ' ');
                        this.suggestedHealthStatus = this.suggestScrapieHealthStatus();
                    }

                    if (illness == 'MAEDI VISNA') {
                        this.currentHealthStatus = location.maedi_visna_status.replace(/-/g, ' ');
                        this.suggestedHealthStatus = this.suggestMaediVisnaHealthStatus();
                    }

                    if (illness == 'CAE') {
                        this.currentHealthStatus = location.cae_status.replace(/-/g, ' ');
                        this.suggestedHealthStatus = this.suggestMaediVisnaHealthStatus();
                    }

                    if (illness == 'CL') {
                        this.currentHealthStatus = location.cl_status.replace(/-/g, ' ');
                        this.suggestedHealthStatus = this.suggestMaediVisnaHealthStatus();
                    }

                    this.foundHealthStatusSuggestion = this.suggestedHealthStatus != '';
                    this.isLoading = false;
                }
            )
    }

    private getRequiredResultCount(): void {
        this.nsfo.doGetRequest(this.nsfo.URI_HEALTH_INSPECTIONS + '/' + this.request.ubn + '/required-results-amount')
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
                res => {
                    let count = res.result;
                    let illness = this.request.inspection;

                    if (illness == 'MAEDI VISNA') {
                        this.requiredCount = count['maedi_visna_required_amount'];
                    }

                    if (illness == 'CAE') {
                        this.requiredCount = count['cae_required_amount'];
                    }

                    if (illness == 'CL') {
                        this.requiredCount = count['cl_required_amount'];
                    }

                    this.getCurrentHealthStatus();
                }
            )
    }

    private suggestMaediVisnaHealthStatus(): string {
        let positiveCount = 0;

        for(let result of this.results) {
            if(result.mv_caepool == 'POSITIVE') {
                positiveCount++
            }
        }

        if(this.currentHealthStatus == 'FREE (1 YEAR)' || this.currentHealthStatus == 'FREE (2 YEAR)') {
            if(positiveCount > 0 || this.results.length < this.requiredCount) {
                return 'UNDER OBSERVATION'
            }

            if(positiveCount == 0 && this.results.length >= this.requiredCount &&
                this.currentHealthStatus == 'FREE (1 YEAR)') {
                return 'FREE (2 YEAR)'
            }

            if(positiveCount == 0 && this.results.length >= this.requiredCount &&
                this.currentHealthStatus == 'FREE (2 YEAR)') {
                return 'FREE (2 YEAR)'
            }
        }

        if(positiveCount == 0 && this.request.certification_status == 'CERTIFICATION') {
            return 'FREE (1 YEAR)'
        }
        
        if(positiveCount > 0 && this.currentHealthStatus) {
            return 'UNDER OBSERVATION'
        }

        if(positiveCount > 0 && !this.currentHealthStatus) {
            return 'UNDER INVESTIGATION'
        }
        
        return '';
    }

    private suggestScrapieHealthStatus(): string {
        let positiveCount = 0;

        // TODO ADD LOGIC

        return '';
    }

    private changeStatus(): void {
        this.savingInProgress = true;
        let request = _.cloneDeep(this.request);

        if (this.request.inspection == 'SCRAPIE') {
            request.scrapie_status = this.form.controls['health_status'].value;
            request.scrapie_end_date = this.form.controls['date_since'].value;
        }

        if (this.request.inspection == 'MAEDI VISNA') {
            request.scrapie_status = this.form.controls['health_status'].value;
            request.scrapie_end_date = this.form.controls['date_till'].value;
        }
        
        this.nsfo.doPutRequest(this.nsfo.URI_HEALTH_INSPECTIONS, request)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
                res => {
                    let result = res.result;
                    this.request.status = result.status;
                    this.request.next_action = result.next_action;
                    this.request.action_taken_by = {
                        "first_name": result.action_taken_by.first_name,
                        "last_name": result.action_taken_by.last_name
                    };

                    this.savingInProgress = false;
                    this.showOverviewPage = true;
                },
                err => {
                    this.savingInProgress = false;
                }
            );

        // TODO ADD REQUEST TO CHANGE LOCATION HEALTH STATUS
        // TODO THERE NEEDS TO BE AN ENDPOINT ON THE API SIDE WHERE YOU CAN SEND A REQUEST PER ILLNESS (RUDOLF?)
    }

    private goToOverviewPage() {
        this.showOverviewPage.emit(false);
    }
}
