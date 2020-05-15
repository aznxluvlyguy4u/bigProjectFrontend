import _ = require("lodash");
import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {Validators} from "@angular/common";
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";
import {UtilsService} from "../../../global/services/utils/utils.service";
import {Observable, Subscription} from "rxjs/Rx";
import { Admin } from '../../../global/models/admin.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    directives: [REACTIVE_FORM_DIRECTIVES],
    template: require('./config.admins.html'),
    pipes: [TranslatePipe]
})

export class ConfigAdminsComponent {
    private admins: Admin[];
    private admin: Admin = new Admin();
    private adminTemp: Admin;
    private selectedAdmin: Admin;
    private superAdminDetails: [] = [];
    private superAdminDetails$: Subscription;
    private isModalEditMode: boolean = false;
    private isValidForm: boolean = true;
    private isSaving: boolean = false;
    private hasUniqueEmails: boolean = true;
    private displayModal: string = 'none';
    private displayRemoveModal: string = 'none';
    private errorMessage: string = '';

    private form: FormGroup;

    private onDestroy$: Subject<void> = new Subject<void>();

    constructor(private nsfo: NSFOService, private fb: FormBuilder, private utils: UtilsService) {
        this.getAdminDetails();
        this.getAdmins();
        
        this.form = fb.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email_address: ['', Validators.required],
            type: ['', Validators.required],

        });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
    }
    
    private getAdminDetails(): void {
        this.superAdminDetails$ = this.utils.getAdminDetails()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(res => {
                this.superAdminDetails['email'] = res.email_address;
            });
    }

    private getAdmins(): void {
        this.nsfo.doGetRequest(this.nsfo.URI_ADMIN)
            .pipe(takeUntil(this.onDestroy$))
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
                    .pipe(takeUntil(this.onDestroy$))
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
        this.nsfo.doPutRequest(this.nsfo.URI_ADMIN + '-deactivate', this.selectedAdmin)
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

    private editAdmin(): void {
        this.isSaving = true;
        if(this.form.valid && this.isValidForm) {
            let isUniqueEmail = this.checkForUniqueEmail(this.admin);

            if(isUniqueEmail) {
                this.nsfo.doPutRequest(this.nsfo.URI_ADMIN, this.admin)
                    .pipe(takeUntil(this.onDestroy$))
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
        this.isValidForm = true;

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
