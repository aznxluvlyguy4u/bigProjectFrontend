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

@Component({
    selector: 'request-auth',
    directives: [REACTIVE_FORM_DIRECTIVES, Datepicker],
    template: require('./tableAuthorization.authorization.html'),
    pipes: [TranslatePipe]
})

export class AuthorizationComponent {
    private form: ControlGroup;
    private savingInProgress: boolean;

    @Input() results = [];
    @Input() request: AnimalHealthRequest = new AnimalHealthRequest();
    @Output() showOverviewPage: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private settings: SettingsService, private fb: FormBuilder, private nsfo: NSFOService) {
        this.form = fb.group({
            health_status: ['FREE'],
            date_since: [''],
            date_till: [''],
        })
    }
    
    private changeStatus(): void {
        this.savingInProgress = true;
        let request = _.cloneDeep(this.request);
        if(this.request.inspection == 'SCRAPIE') {
            request.scrapie_status = this.form.controls['health_status'].value;
            request.scrapie_end_date = this.form.controls['date_since'].value;
        }

        this.nsfo.doPutRequest(this.nsfo.URI_HEALTH_INSPECTIONS, request)
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
            )
    }

    private goToOverviewPage() {
        this.showOverviewPage.emit(false);
    }
}
