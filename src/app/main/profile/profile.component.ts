import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators, FormGroup} from "@angular/forms";


@Component({
    directives: [REACTIVE_FORM_DIRECTIVES],
    templateUrl: '/app/main/profile/profile.component.html',
    pipes: [TranslatePipe]
})

export class ProfileComponent {
    private form: FormGroup;
    private isValidForm: boolean = true;

    constructor(private fb: FormBuilder) {
        this.form = fb.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email_address: ['', Validators.required],
            password: [''],
            repeat_password: [''],
        });
    }

    private saveProfile() {
        this.isValidForm = true;

        if(this.form.valid && this.isValidForm) {
            console.log(this.form.value);
        } else {
            this.isValidForm = false;
        }
    }
}