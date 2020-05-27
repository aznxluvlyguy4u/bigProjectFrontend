import {Component} from "@angular/core";
import {Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder, Validators} from "@angular/forms";
import {NSFOService} from "../global/services/nsfo/nsfo.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    directives: [REACTIVE_FORM_DIRECTIVES],
    template: require('./login.component.html'),
    pipes: [TranslatePipe]
})

export class LoginComponent {
    private isAuthenticating: boolean = false;
    private isValidForm: boolean = true;
    private hasSendEmail: boolean = false;
    private enableRecoverPasswordForm: boolean = false;

    private form: FormGroup;
    private formPasswordRecovery: FormGroup;

    private onDestroy$: Subject<void> = new Subject<void>();

    constructor(private nsfo: NSFOService, private fb:FormBuilder, private router: Router) {
        this.form = fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
        });

        this.formPasswordRecovery = fb.group({
            email_address: ['', Validators.required],
        });
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private requestNewPassword() {
        this.nsfo.doPutRequest(this.nsfo.URI_RESET_PASSWORD, this.formPasswordRecovery.value)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(()=>{});
        this.hasSendEmail = true;
    }


    private enableForgetPassword() {
        this.enableRecoverPasswordForm = !this.enableRecoverPasswordForm;
    }

    private doLogin() {
        if (this.form.valid) {
            this.isValidForm = true;
            this.isAuthenticating = true;
            this.nsfo.doLoginRequest((this.form.controls['username'].value).toLowerCase(), this.form.controls['password'].value)
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(
                    res => {
                        let result = res.result;
                        if (result['access_token']) {
                            localStorage.setItem('access_token', result['access_token']);
                            this.router.navigate(['/dashboard']);
                        } else {
                            this.isValidForm = false;
                            this.isAuthenticating = false;
                        }
                        this.nsfo.retrieveDataAfterLogin();
                    },
                    err => {
                        this.isValidForm = false;
                        this.isAuthenticating = false;
                    }
                );
        } else {
            this.isValidForm = false;
            this.isAuthenticating = false;
        }
    }

    private resetForm() {
        this.hasSendEmail = false;
        (<FormControl>this.form.controls['username']).updateValue('');
        (<FormControl>this.form.controls['password']).updateValue('');
        (<FormControl>this.formPasswordRecovery.controls['email_address']).updateValue('');
    }
}
