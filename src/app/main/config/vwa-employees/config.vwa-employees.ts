import _ = require("lodash");
import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import { VwaEmployee } from '../../../global/models/vwa-employee.model';
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {Validators} from "@angular/common";
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    directives: [REACTIVE_FORM_DIRECTIVES],
    template: require('./config.vwa-employees.html'),
    pipes: [TranslatePipe]
})

export class ConfigVwaEmployeesComponent {
    private vwaEmployees: VwaEmployee[];
    private vwaEmployee: VwaEmployee = new VwaEmployee();
    private vwaEmployeeTemp: VwaEmployee;
    private selectedVwaEmployee: VwaEmployee;
    private isModalEditMode: boolean = false;
    private isValidForm: boolean = true;
    private isSaving: boolean = false;
    private hasUniqueEmails: boolean = true;
    private displayModal: string = 'none';
    private displayRemoveModal: string = 'none';
    private errorMessage: string = '';

    private form: FormGroup;

    private onDestroy$: Subject<void> = new Subject<void>();

    constructor(private nsfo: NSFOService, private fb: FormBuilder) {
        this.getVwaEmployees();
        
        this.form = fb.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email_address: ['', Validators.required],
        });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
    }

    private getVwaEmployees(): void {
        this.nsfo.doGetRequest(this.nsfo.URI_VWA_EMPLOYEE + '?active_only=true')
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
                res => {
                    this.vwaEmployees= <VwaEmployee[]> res.result;
                }
            );
    }

    private addVwaEmployee(): void {
        this.isValidForm = true;
        this.isSaving = true;

        if(this.form.valid && this.isValidForm) {
            let isUniqueEmail = this.checkForUniqueEmail(this.vwaEmployee);

            if(isUniqueEmail) {
                this.nsfo.doPostRequest(this.nsfo.URI_VWA_EMPLOYEE, this.vwaEmployee)
                    .pipe(takeUntil(this.onDestroy$))
                    .subscribe(
                        res => {
                            let result = res.result;
                            this.vwaEmployee.person_id = result.person_id;
                            this.vwaEmployees.push(this.vwaEmployee);
                            this.isSaving = false;
                            this.closeModal();
                        },
                        err => {
                            this.isSaving = false;
                            this.errorMessage = "SOMETHING WENT WRONG. TRY ANOTHER TIME."
                        }
                    );
            } else {
                this.hasUniqueEmails = false;
                this.isSaving = false;
            }
        } else {
            this.isValidForm = false;
            this.isSaving = false;
        }
    }

    private removeVwaEmployee(): void {
        this.isSaving = true;

        _.remove(this.vwaEmployees, this.selectedVwaEmployee);
        this.nsfo.doDeleteRequest(this.nsfo.URI_VWA_EMPLOYEE + '/' + this.selectedVwaEmployee.person_id, this.selectedVwaEmployee)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
                res => {
                    this.isSaving = false;
                    this.closeRemoveModal();
                },
                err => {
                    this.isSaving = false;
                    this.errorMessage = "SOMETHING WENT WRONG. TRY ANOTHER TIME."
                }
            );
    }

    private editVwaEmployee(): void {
        this.isSaving = true;
        if(this.form.valid && this.isValidForm) {
            let isUniqueEmail = this.checkForUniqueEmail(this.vwaEmployee);

            if(isUniqueEmail) {
                this.nsfo.doPutRequest(this.nsfo.URI_VWA_EMPLOYEE + '/' + this.vwaEmployee.person_id, this.vwaEmployee)
                    .pipe(takeUntil(this.onDestroy$))
                    .subscribe(
                        res => {
                            _.remove(this.vwaEmployees, this.vwaEmployeeTemp);
                            this.vwaEmployees.push(this.vwaEmployee);
                            this.isSaving = false;
                            this.closeModal();
                        },
                        err => {
                            this.isSaving = false;
                            this.errorMessage = "SOMETHING WENT WRONG. TRY ANOTHER TIME."
                        }
                    );
            } else {
                this.hasUniqueEmails = false;
                this.isSaving = false;
            }
        } else {
            this.isValidForm = false;
            this.isSaving = false;
        }
    }

    private openModal(editMode: boolean, admin: VwaEmployee): void {
        this.isModalEditMode = editMode;
        this.displayModal = 'block';
        this.isValidForm = true;

        if(editMode) {
            this.vwaEmployee = _.cloneDeep(admin);
            this.vwaEmployeeTemp = _.cloneDeep(admin);
        }
    }

    private closeModal(): void {
        this.displayModal = 'none';
        this.errorMessage = '';
        this.vwaEmployee = new VwaEmployee();
        this.resetValidation();
    }

    private openRemoveModal(vwaEmployee: VwaEmployee) {
        this.selectedVwaEmployee = vwaEmployee;
        this.displayRemoveModal = 'block';
    }

    private closeRemoveModal() {
        this.errorMessage = '';
        this.displayRemoveModal = 'none';
    }

    private checkForUniqueEmail(vwaEmployee: VwaEmployee) {
        let index = _.findIndex(this.vwaEmployees, ['email_address', vwaEmployee.email_address]);

        if (this.vwaEmployeeTemp) {
            return index < 0 || this.vwaEmployeeTemp.email_address == this.vwaEmployee.email_address;
        }

        return index < 0;
    }

    private resetValidation(): void {
        this.isValidForm = true;
    }
}
