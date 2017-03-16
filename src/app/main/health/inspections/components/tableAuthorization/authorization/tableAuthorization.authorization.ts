import _ = require("lodash");
import {Component, Input, Output} from "@angular/core";
import {EventEmitter} from "@angular/platform-browser-dynamic/src/facade/async";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {SettingsService} from "../../../../../../global/services/settings/settings.service";
import {Datepicker} from "../../../../../../global/components/datepicker/datepicker.component";
import {REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {ControlGroup, FormBuilder} from "@angular/common";
import {AnimalHealthRequest, LabResult} from "../../../../health.model";
import {NSFOService} from "../../../../../../global/services/nsfo/nsfo.service";

import { EditableComponent } from '../../../../../../global/components/editable/editable.component';

@Component({
    selector: 'request-auth',
    directives: [REACTIVE_FORM_DIRECTIVES, Datepicker, EditableComponent],
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
    private counterValue = 0;

    @Input() labResult:LabResult = new LabResult();
    @Input() request: AnimalHealthRequest = new AnimalHealthRequest();
    @Output() showOverviewPage: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private settings: SettingsService, private fb: FormBuilder, private nsfo: NSFOService) {
        this.form = fb.group({
            health_status: [''],
            date_since: [''],
            date_till: [''],
        })
    }

    ngOnChanges() {
        if(this.labResult) {
            this.getCurrentHealthStatus();
        }
    }

    private getCurrentHealthStatus(): void {
        this.nsfo.doGetRequest(this.nsfo.URI_HEALTH_UBN + '/' + this.request.ubn)
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
        // this.nsfo.doGetRequest(this.nsfo.URI_HEALTH_INSPECTIONS + '/' + this.request.ubn + '/required-results-amount')
        //     .subscribe(
        //         res => {
        //             let count = res.result;
        //             let illness = this.request.inspection;

        //             if (illness == 'MAEDI VISNA') {
        //                 this.requiredCount = count['maedi_visna_required_amount'];
        //             }

        //             if (illness == 'CAE') {
        //                 this.requiredCount = count['cae_required_amount'];
        //             }

        //             if (illness == 'CL') {
        //                 this.requiredCount = count['cl_required_amount'];
        //             }

        //             this.getCurrentHealthStatus();
        //         }
        //     )
    }

    private suggestMaediVisnaHealthStatus(): string {
        let positiveCount = 0;

        for(let lab_result of this.labResult.lab_results) {
            if(lab_result.mv_caepool == 'POSITIVE') {
                positiveCount++
            }
        }

        if(this.currentHealthStatus == 'FREE (1 YEAR)' || this.currentHealthStatus == 'FREE (2 YEAR)') {
            if(positiveCount > 0 || this.labResult.lab_results.length < this.requiredCount) {
                return 'UNDER OBSERVATION'
            }

            if(positiveCount == 0 && this.labResult.lab_results.length >= this.requiredCount &&
                this.currentHealthStatus == 'FREE (1 YEAR)') {
                return 'FREE (2 YEAR)'
            }

            if(positiveCount == 0 && this.labResult.lab_results.length >= this.requiredCount &&
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

    private saveLabResult(){
        let body = {
            result:this.labResult
        }
        this.savingInProgress = true;
        this.nsfo.doPostRequest(this.nsfo.URI_LAB_RESULTS, body)
        .subscribe(
            res => {
                console.log(res.result)
                this.labResult = res.result;
                this.savingInProgress = false;
            },
            err => {
                this.savingInProgress = false;
            }
        );
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
            .subscribe(
                res => {
                    console.log(res);
                    let result = res.result;
                    this.request.status = result.status;
                    this.request.next_action = result.next_action;
                    this.request.action_taken_by = {
                        "first_name": result.action_taken_by.first_name,
                        "last_name": result.action_taken_by.last_name
                    };

                    this.savingInProgress = false;
                    this.showOverviewPage.emit(true);
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
