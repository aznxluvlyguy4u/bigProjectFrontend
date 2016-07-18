import _ from 'lodash';
import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {User} from "../config.model";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {Validators} from "@angular/common";
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES} from "@angular/forms";

@Component({
    directives: [REACTIVE_FORM_DIRECTIVES],
    templateUrl: '/app/main/config/users/config.users.html',
    pipes: [TranslatePipe]
})

export class ConfigUsersComponent {
    private users: User[];
    private user: User = new User();
    private userTemp: User;
    private isModalEditMode: boolean = false;
    private isValidForm: boolean = true;
    private hasUniqueEmails: boolean = true;
    private displayModal: string = 'none';

    private form: FormGroup;

    constructor(private nsfo: NSFOService, private fb: FormBuilder) {
        this.getUsers();

        this.form = fb.group({
            first_name: ['', Validators.required],
            last_name: ['', Validators.required],
            email_address: ['', Validators.required],
            type: ['', Validators.required],

        });
    }
    
    private getUsers(): void {
        this.nsfo.doGetUsers()
            .subscribe(
                res => {
                    this.users = <User[]> res.result;
                }
            )
    }

    private addUser(): void {
        this.isValidForm = true;

        if(this.form.valid && this.isValidForm) {
            let isUniqueEmail = this.checkForUniqueEmail(this.user);

            if(isUniqueEmail) {
                this.users.push(this.user);
                this.closeModal();
            } else {
                this.hasUniqueEmails = false;
            }
        } else {
            this.isValidForm = false;
        }
    }

    private removeUser(user: User): void {
        _.remove(this.users, user);
    }

    private editUser(): void {
        if(this.form.valid && this.isValidForm) {
            let isUniqueEmail = this.checkForUniqueEmail(this.user);

            if(isUniqueEmail) {
                this.removeUser(this.userTemp);
                this.users.push(this.user);
                this.closeModal();
            } else {
                this.hasUniqueEmails = false;
            }
        } else {
            this.isValidForm = false;
        }
    }

    private resendPassword(user: User): void {}

    private openModal(editMode: boolean, user: User): void {
        this.isModalEditMode = editMode;
        this.displayModal = 'block';

        if(editMode) {
            this.user = _.cloneDeep(user);
            this.userTemp = _.cloneDeep(user);
        }
    }

    private closeModal(): void {
        this.displayModal = 'none';
        this.user = new User();
        this.resetValidation();
    }

    private checkForUniqueEmail(user: User) {
        let index = _.findIndex(this.users, ['email_address', user.email_address]);

        if (this.userTemp) {
            return index < 0 || this.userTemp.email_address == this.user.email_address;
        }

        return index < 0;
    }

    private resetValidation(): void {
        this.isValidForm = true;
    }
}
