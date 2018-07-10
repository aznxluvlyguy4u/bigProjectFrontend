import _ = require('lodash');
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {TranslatePipe} from 'ng2-translate/ng2-translate';
import {LocationHealthInspection} from '../../../../health.model';
import {SettingsService} from '../../../../../../global/services/settings/settings.service';
import {LabResultsUploaderComponent} from '../../../../../../global/components/labresultsuploader/lab-results-uploader.component';

@Component({
    selector: 'health-table-to-receive-lab-results',
    template: require('./inspections.tableToReceiveLabResults.html'),
    pipes: [TranslatePipe],
    directives: [LabResultsUploaderComponent]
})

export class HealthTableToReceiveLabResults {
    private isLoading:boolean;
    private _toReceiveLabResults:Array<LocationHealthInspection>;
    private editMode: boolean = false;

    @Output() _cancelInspection = new EventEmitter();


    @Input()
    set toReceiveLabResults(toReceiveLabResults: Array<LocationHealthInspection>) {
        this._toReceiveLabResults = toReceiveLabResults || [];
    }
    get toReceiveLabResults(): Array<LocationHealthInspection> { return this._toReceiveLabResults; }

    constructor(private settings: SettingsService) {}

    ngOnInit(){ }

    cancelInspection(event){
      this._cancelInspection.emit(event);
    }
    
}
