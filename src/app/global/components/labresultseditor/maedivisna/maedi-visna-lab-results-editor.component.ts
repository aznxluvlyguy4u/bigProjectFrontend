import {Component, EventEmitter, Input, Output} from "@angular/core";
import {NSFOService} from "../../../services/nsfo/nsfo.service";
import {LabResultItem, LocationHealthInspection} from "../../../../main/health/health.model";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {TranslatePipe} from "ng2-translate";
import {FormBuilder, FormGroup, REACTIVE_FORM_DIRECTIVES, Validator, Validators} from "@angular/forms";
import {LabResultFile} from "../../../models/lab-result-file.model";
import {LabResultMaediVisna} from "../../../models/lab-result.model";

@Component({
    selector: 'maedi-visna-lab-results-editor',
    template: require('./maedi-visna-lab-results-editor.component.html'),
    pipes: [TranslatePipe],
    directives: [REACTIVE_FORM_DIRECTIVES]
})

export class MaediVisnaLabResultsEditorComponent {
    @Input() inspection: LocationHealthInspection;
    @Input() labResults: LabResultMaediVisna[];
    @Output() revisedResults = new EventEmitter<LabResultFile[]>();
    private displayModal = 'none';

    constructor(private apiService: NSFOService, private fb: FormBuilder){

    }

    openModal() {
        this.displayModal = 'block';
    }

    closeModal() {
        this.displayModal = 'none';
    }
}