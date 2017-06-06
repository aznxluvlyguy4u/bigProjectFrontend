import _ = require("lodash");
import {Component, OnInit, Input, Output} from "@angular/core";
import {EventEmitter} from "@angular/platform-browser-dynamic/src/facade/async";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {SettingsService} from "../../../../../../global/services/settings/settings.service";
import {Datepicker} from "../../../../../../global/components/datepicker/datepicker.component";
import {REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {ControlGroup, FormBuilder} from "@angular/common";
import {LabResult, HealthStatus, LocationHealthInspection} from "../../../../health.model";
import {NSFOService} from "../../../../../../global/services/nsfo/nsfo.service";
import {HealthService} from '../../../../health.service';
import {EditableComponent} from '../../../../../../global/components/editable/editable.component';

@Component({
    selector: 'request-auth',
    directives: [REACTIVE_FORM_DIRECTIVES, Datepicker, EditableComponent],
    template: require('./tableAuthorization.authorization.html'),
    pipes: [TranslatePipe]
})

export class AuthorizationComponent implements OnInit{
    private form: ControlGroup;
    private savingInProgress: boolean;
    private isLoading: boolean = true;
    private foundHealthStatusSuggestion: boolean;
    private currentHealthStatus: string;
    private requiredCount: number;
    private suggestedHealthStatus: string;
    private counterValue = 0;
    private currentHStatus:any;
    private newHealthStatus:HealthStatus;

    private _inspection: LocationHealthInspection

    @Input() labResult:LabResult = new LabResult();
    @Output() showOverviewPage: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input()
    set inspection(inspection: LocationHealthInspection){
        this._inspection = inspection;
    }

    get inspection(){
      return this._inspection
    }

    constructor( private healthService: HealthService, private settings: SettingsService, private fb: FormBuilder, private nsfo: NSFOService) { }

    ngOnInit() {
        this.form = this.fb.group({
            health_status: [''],
            check_date: [''],
            reason_of_edit: ['']
        });

        /** get the lab results for current inspection */
        this.healthService.getLabResults(this._inspection)
            .subscribe(
                res => {
                    console.log('LAB RESULT RESPONSE = ');
                    console.log(res);
                    this.labResult = res.result;
                    this.isLoading = false;
                },
                err => {

                }
            )
    }

    private getCurrentHealthStatus(): void {
        this.nsfo.doGetRequest(this.nsfo.URI_HEALTH_UBN + '/' + this.inspection.ubn)
            .subscribe(
                res => {
                    this.currentHStatus = res.result;
                    let location = res.result;
                    let illness = this.inspection.illness_type;

                    // if (illness == 'SCRAPIE') {
                    //         this.currentHealthStatus = location.scrapie_status; //.replace(/-/g, ' ');
                    //         this.suggestedHealthStatus = this.suggestScrapieHealthStatus();
                    // }

                    // if (illness == 'MAEDI VISNA') {
                    //     this.currentHealthStatus = location.maedi_visna_status; //.replace(/-/g, ' ');
                    //     this.suggestedHealthStatus = this.suggestMaediVisnaHealthStatus();
                    // }

                    // if (illness == 'CAE') {
                    //         this.currentHealthStatus = location.cae_status; //.replace(/-/g, ' ');
                    //         this.suggestedHealthStatus = this.suggestMaediVisnaHealthStatus();
                    // }

                    // if (illness == 'CL') {
                    //         this.currentHealthStatus = location.cl_status; //.replace(/-/g, ' ');
                    //         this.suggestedHealthStatus = this.suggestMaediVisnaHealthStatus();
                    // }

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

        // for(let lab_result of this.labResult.lab_results) {
        //     if(lab_result.mv_caepool == 'POSITIVE') {
        //         positiveCount++
        //     }
        // }

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

        if(positiveCount == 0 && this.inspection.certification_status == 'CERTIFICATION') {
            return 'FREE (1 YEAR)'
        }

        if(positiveCount > 0 && this.currentHealthStatus) {
            return 'UNDER OBSERVATION'
        }

        if(positiveCount > 0 && !this.currentHealthStatus) {
            return 'UNDER INVESTIGATION'
        }

        if(this.currentHealthStatus == null){
            return '';
        }

        return '';
    }

    // private suggestScrapieHealthStatus(): string {
    //     let positiveCount = 0;

    //     // TODO ADD LOGIC

    //     return '';
    // }

    private saveLabResult(){
        let body = {
            result:this.labResult
        }
        this.savingInProgress = true;
        this.nsfo.doPostRequest(this.nsfo.URI_LAB_RESULTS, body)
        .subscribe(
            res => {
                this.labResult = res.result;
                this.savingInProgress = false;
            },
            err => {
                this.savingInProgress = false;
            }
        );
    }

    private changeStatus(): void {
        // this.savingInProgress = true;


        // this.newHealthStatus = new HealthStatus();
        // this.newHealthStatus.status = this.form.controls['health_status'].value;
        // this.newHealthStatus.check_date = this.form.controls['check_date'].value;
        // this.newHealthStatus.illness = this.inspection.illness_type;
        // this.newHealthStatus.reason_of_edit = 'Authorization';

        // this.nsfo.doPutRequest(this.nsfo.URI_HEALTH_UBN + '/' + this.inspection.ubn, this.newHealthStatus)
        //     .subscribe(res => {
        //         this.updateInspection();
        //     });

        // TODO ADD REQUEST TO CHANGE LOCATION HEALTH STATUS
        // TODO THERE NEEDS TO BE AN ENDPOINT ON THE API SIDE WHERE YOU CAN SEND A REQUEST PER ILLNESS (RUDOLF?)
    }

    // updateInspection(){
    //     let request = _.cloneDeep(this.inspection);
    //     this.nsfo.doPutRequest(this.nsfo.URI_HEALTH_INSPECTIONS, request)
    //             .subscribe(
    //                 res => {
    //                     let result = res.result;
    //                     this.inspection.status = result.status;
    //                     this.inspection.next_action = result.next_action;
    //                     this.inspection.action_taken_by = {
    //                         "first_name": result.action_taken_by.first_name,
    //                         "last_name": result.action_taken_by.last_name
    //                     };

    //                     this.ngOnChanges();
    //                     this.savingInProgress = false;
    //                     this.showOverviewPage.emit(false);
    //                 },
    //                 err => {
    //                     this.savingInProgress = false;
    //                 }
    //             );
    // }

    private goToOverviewPage() {
        this.showOverviewPage.emit(false);
    }
}
