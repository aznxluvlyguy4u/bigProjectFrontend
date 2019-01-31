import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators, FormGroup} from "@angular/forms";
import {NSFOService} from "../../global/services/nsfo/nsfo.service";
import {AdminProfile} from "./profile.model";
import {PasswordValidator} from "./validator/profile.validator";
import {Router} from "@angular/router";
import {UtilsService} from "../../global/services/utils/utils.service";

@Component({
    directives: [REACTIVE_FORM_DIRECTIVES],
    template: require('./profile.component.html'),
    pipes: [TranslatePipe]
})

export class ProfileComponent {
    private form: FormGroup;
    private profile: AdminProfile = new AdminProfile();
    private isValidForm: boolean = true;
    private isSaving: boolean = false;
    private errorMessage: string;

    constructor(private fb: FormBuilder, private nsfo: NSFOService, private router: Router, private utils: UtilsService) {
        this.form = fb.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email_address: ['', Validators.required],
            password:['', Validators.minLength(6)],
            repeat_password: ['', Validators.minLength(6)]
        });
        this.form.validator = PasswordValidator.validatePassword;
        
        this.getProfile();
    }

    private getProfile() {
        this.nsfo.doGetRequest(this.nsfo.URI_ADMIN_PROFILE)
            .subscribe(
                res => {
                    this.profile = res.result;
                    this.profile.new_password = '';
                }
            )
    }

    private saveProfile() {
        this.isValidForm = true;
        this.isSaving = true;

        if(this.form.valid && this.isValidForm) {
            let request = {
                "first_name": this.profile.first_name,
                "last_name": this.profile.last_name,
                "email_address": this.profile.email_address,
                "new_password": btoa(this.profile.new_password)
            };

            this.nsfo.doPutRequest(this.nsfo.URI_ADMIN_PROFILE, request)
                .subscribe(
                    res => {
                        this.utils.initAdminDetails();
                        this.isSaving = false;
                        this.router.navigate(['/dashboard']);
                    },
                    err => {
                        this.isSaving = false;
                        this.errorMessage = "SOMETHING WENT WRONG. TRY ANOTHER TIME."
                    }
                )
        } else {
            this.isValidForm = false;
            this.isSaving = false;
        }
    }
}