import _ = require("lodash");
import {Component, OnInit, Input, Output} from "@angular/core";
import {EventEmitter} from "@angular/platform-browser-dynamic/src/facade/async";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {ControlGroup, FormBuilder} from "@angular/common";
import {HealthStatus, LocationHealthInspection} from "../../../../../health.model";
import { _MAEDI_VISNA, _SCRAPIE } from '../../../../../../../global/constants/illness-type.constant';
import { Datepicker } from '../../../../../../../global/components/datepicker/datepicker.component';
import { SettingsService } from '../../../../../../../global/services/settings/settings.service';
import { EditableComponent } from '../../../../../../../global/components/editable/editable.component';
import { HealthService } from '../../../../../health.service';
import { NSFOService } from '../../../../../../../global/services/nsfo/nsfo.service';
import {LabResultFile} from "../../../../../../../global/models/lab-result-file.model";

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
    private fileList: LabResultFile[];
    private foundHealthStatusSuggestion: boolean;
    private currentHealthStatus: string;
    private requiredCount: number;
    private suggestedHealthStatus: string;
    private counterValue = 0;
    private currentHStatus:any;
    private newHealthStatus:HealthStatus;

    private _inspection: LocationHealthInspection;

    @Input() labResult: LabResultFile[];
    @Output() showOverviewPage: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() _authorizeInspection = new EventEmitter();

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
                    this.fileList = res.result;
                    console.log(this.fileList);
                    this.isLoading = false;
                },
                err => {

                }
            )
    }

    useDateUntil(): boolean {
        switch (this.healthService.selectedIllness) {
          case _MAEDI_VISNA: return true;
          case _SCRAPIE: return false;
          default: return true;
        }
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

        // for(let lab_result of this.labResult.results) {
        //     if(lab_result.mv_caepool == 'POSITIVE') {
        //         positiveCount++
        //     }
        // }

        if(this.currentHealthStatus == 'FREE (1 YEAR)' || this.currentHealthStatus == 'FREE (2 YEAR)') {
            for (let file of this.fileList) {
                if(positiveCount > 0 || file.results.length < this.requiredCount) {
                    return 'UNDER OBSERVATION'
                }

                if(positiveCount == 0 && file.results.length >= this.requiredCount &&
                    this.currentHealthStatus == 'FREE (1 YEAR)') {
                    return 'FREE (2 YEAR)'
                }

                if(positiveCount == 0 && file.results.length >= this.requiredCount &&
                    this.currentHealthStatus == 'FREE (2 YEAR)') {
                    return 'FREE (2 YEAR)'
                }
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
        for (let file of this.fileList) {
            for (let result of file.results) {
                console.log(result);
            }
        } 
        // let body = {
        //     result:this.labResult
        // }
        // this.savingInProgress = true;
        // this.nsfo.doPostRequest(this.nsfo.URI_LAB_RESULTS, body)
        // .subscribe(
        //     res => {
        //         this.labResult = res.result;
        //         this.savingInProgress = false;
        //     },
        //     err => {
        //         this.savingInProgress = false;
        //     }
        // );
    }

    private changeStatus(): void {

    }

    private goToOverviewPage() {
        this.showOverviewPage.emit(false);
    }

    private authorizeInspection(){
      this.healthService.finishInspection(this._inspection)
        .subscribe(
              res => {
                this.healthService.loadToAuthorize();
                this.healthService.loadFinished();
                this.goToOverviewPage();
              },
              err => {
                // handle error
              }
          );
    }
}
