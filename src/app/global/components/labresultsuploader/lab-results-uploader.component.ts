import {Component, Input} from "@angular/core";
import {NSFOService} from "../../services/nsfo/nsfo.service";
import {LocationHealthInspection} from "../../../main/health/health.model";
import {Headers, Http, RequestOptions} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {TranslatePipe} from "ng2-translate";
import {FormBuilder, FormGroup, REACTIVE_FORM_DIRECTIVES, Validator, Validators} from "@angular/forms";

@Component({
    selector: 'lab-results-uploader',
    template: require('./lab-results-uploader.component.html'),
    pipes: [TranslatePipe],
    directives: [REACTIVE_FORM_DIRECTIVES]
})

export class LabResultsUploaderComponent {

    @Input() inspection: LocationHealthInspection;
    private file;
    private displayModal = 'none';
    private form: FormGroup;
    private fileEvent;
    private errorText = '';
    private displayErrorText = false;

    constructor(private http: Http, private apiService: NSFOService, private fb: FormBuilder){
        this.form = fb.group({
            lab_file: [null, Validators.required],
            nsfo_reference_number: ["", Validators.required],
            lab_reference_number: ["", Validators.required]
        });
    }

    setFile(event) {
        this.fileEvent = event;
        let fileList: FileList = event.target.files;
        if(fileList.length > 0) {
            let file: File = fileList[0];
            this.file = file;
            }
    }

    uploadFile() {
        let labReference = this.form.controls['lab_reference_number'].value;
        let nsfoReference = this.form.controls['nsfo_reference_number'].value;
        let formData:FormData = new FormData();
        formData.append('uploadFile', this.file, this.file.name);
        let errorText = '';
        if (!labReference || labReference === '') {
            errorText = 'NO LAB REFERENCE';
        }
        if (!nsfoReference || nsfoReference === '') {
            errorText += ' NO NSFO REFERENCE';
        }
        if (!formData) {
            errorText += ' NO FILE ';
        }

        if (this.file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            || this.file.type !== 'application/vnd.ms-excel'
            || this.file.type !== 'text/csv') {
            errorText += ' UNSUPPORTED FILE FORMAT ';
        }

        if (errorText != '') {
            this.errorText = errorText;
            this.displayErrorText = true;
            return;
        }
        this.apiService.doUploadRequest(this.apiService.URI_LAB_RESULTS + '/' + this.inspection.inspection_id + '/upload'
            + '?nsfo_reference_number=' + nsfoReference + '&lab_reference_number=' + labReference, this.file)
            .subscribe(
            res => {
                this.closeModal();
            }
        );
    }

    openModal() {
        this.displayModal = 'block';
    }

    closeModal() {
        this.displayModal = 'none';
    }
}