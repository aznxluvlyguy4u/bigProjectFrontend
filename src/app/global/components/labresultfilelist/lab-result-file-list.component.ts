import {Component, Input, Output} from "@angular/core";
import {NSFOService} from "../../services/nsfo/nsfo.service";
import {LabResultItem, LocationHealthInspection} from "../../../main/health/health.model";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {TranslatePipe} from "ng2-translate";
import {FormBuilder, FormGroup, REACTIVE_FORM_DIRECTIVES, Validator, Validators} from "@angular/forms";
import {LabResultFile} from "../../models/lab-result-file.model";
import {MaediVisnaLabResultsEditorComponent} from "../labresultseditor/maedivisna/maedi-visna-lab-results-editor.component";
import EventEmitter = NodeJS.EventEmitter;
import {ScrapieLabResultsEditorComponent} from "../labresultseditor/scrapie/scrapie-lab-results-editor.component";

@Component({
    selector: 'lab-result-file-list-viewer',
    template: require('./lab-result-file-list.component.html'),
    pipes: [TranslatePipe],
    directives: [REACTIVE_FORM_DIRECTIVES, MaediVisnaLabResultsEditorComponent, ScrapieLabResultsEditorComponent]
})

export class LabResultFileListComponent {
    @Input() inspection: LocationHealthInspection;
    @Input() labResultFiles: LabResultFile[];
    private file;
    private displayModal = 'none';

    constructor(private http: Http, private apiService: NSFOService, private fb: FormBuilder){
    }

    openModal() {
        this.displayModal = 'block';
    }

    closeModal() {
        this.displayModal = 'none';
    }
}