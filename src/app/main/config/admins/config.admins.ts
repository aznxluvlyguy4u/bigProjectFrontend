import _ from 'lodash';
import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Admin} from "../config.model";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {Validators} from "@angular/common";
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";

@Component({
    directives: [REACTIVE_FORM_DIRECTIVES],
    templateUrl: '/app/main/config/admins/config.admins.html',
    pipes: [TranslatePipe]
})

export class ConfigAdminsComponent {
    private admins: Admin[];
    private admin: Admin = new Admin();
    private adminTemp: Admin;
    private selectedAdmin: Admin;
    private isModalEditMode: boolean = false;
    private isValidForm: boolean = true;
    private isSaving: boolean = false;
    private hasUniqueEmails: boolean = true;
    private displayModal: string = 'none';
    private displayRemoveModal: string = 'none';
    private errorMessage: string = '';

    private form: FormGroup;

    constructor(private nsfo: NSFOService, private fb: FormBuilder) {
        this.getAdmins();

        this.form = fb.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email_address: ['', Validators.required],
            type: ['', Validators.required],

        });
    }
    
    private getAdmins(): void {
        this.nsfo.doGetRequest(this.nsfo.URI_ADMIN)
            .subscribe(
                res => {
                    this.admins= <Admin[]> res.result;
                }
            );
    }

    private addAdmin(): void {
        this.isValidForm = true;
        this.isSaving = true;

        if(this.form.valid && this.isValidForm) {
            let isUniqueEmail = this.checkForUniqueEmail(this.admin);

            if(isUniqueEmail) {
                this.nsfo.doPostRequest(this.nsfo.URI_ADMIN, this.admin)
                    .subscribe(
                        res => {
                            let result = res.result;
                            this.admin.person_id = result.person_id;
                            this.admins.push(this.admin);
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

    private removeAdmin(): void {
        this.isSaving = true;
        _.remove(this.admins, this.selectedAdmin);
        let request = {
            "admins": [this.selectedAdmin]
        };
        
        this.nsfo.doPutRequest(this.nsfo.URI_ADMIN + '-deactivate', request)
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

    private editAdmin(): void {
        this.isSaving = true;
        if(this.form.valid && this.isValidForm) {
            let isUniqueEmail = this.checkForUniqueEmail(this.admin);

            if(isUniqueEmail) {
                let request = {
                    "admins": [this.admin]
                };

                this.nsfo.doPutRequest(this.nsfo.URI_ADMIN, request)
                    .subscribe(
                        res => {
                            _.remove(this.admins, this.adminTemp);
                            this.admins.push(this.admin);
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

    private resendPassword(admin: Admin): void {}

    private openModal(editMode: boolean, admin: Admin): void {
        this.isModalEditMode = editMode;
        this.displayModal = 'block';

        if(editMode) {
            this.admin = _.cloneDeep(admin);
            this.adminTemp = _.cloneDeep(admin);
        }
    }

    private closeModal(): void {
        this.displayModal = 'none';
        this.errorMessage = '';
        this.admin = new Admin();
        this.resetValidation();
    }

    private openRemoveModal(admin: Admin) {
        this.selectedAdmin = admin;
        this.displayRemoveModal = 'block';
    }

    private closeRemoveModal() {
        this.errorMessage = '';
        this.displayRemoveModal = 'none';
    }

    private checkForUniqueEmail(admin: Admin) {
        let index = _.findIndex(this.admins, ['email_address', admin.email_address]);

        if (this.adminTemp) {
            return index < 0 || this.adminTemp.email_address == this.admin.email_address;
        }

        return index < 0;
    }

    private resetValidation(): void {
        this.isValidForm = true;
    }
}