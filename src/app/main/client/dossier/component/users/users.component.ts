import _ from 'lodash';
import {Component, Input, Output} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {User} from "../../../client.model";
import {FormGroup, FormControl, REACTIVE_FORM_DIRECTIVES, FormBuilder} from "@angular/forms";
import {Validators} from "@angular/common";
import {EventEmitter} from "@angular/platform-browser-dynamic/src/facade/async";

@Component({
    selector: 'users-display',
    directives: [REACTIVE_FORM_DIRECTIVES],
    templateUrl: '/app/main/client/dossier/component/users/users.component.html',
    pipes: [TranslatePipe]
})

export class UsersDisplay {
    private displayModal: string = 'none';
    private isModalEditMode: boolean = false;
    private hasPrimaryContactPerson: boolean = false;
    private hasUniqueEmails: boolean = true;
    private isValidForm: boolean = true;
    private form: FormGroup;
    private user: User = new User();
    private userTemp: User;

    @Input() users: User[] = [];
    @Input() disabledMode: boolean = false;
    @Output() updated: EventEmitter<User[]> = new EventEmitter<User[]>();

    constructor(private fb: FormBuilder) {
        this.form = fb.group({
            first_name: [],
            last_name: [],
            email_address: ['', Validators.required],
            primary_contactperson: ['YES']
        });
    }

    private openModal(editMode: boolean, user: User): void {
        this.isModalEditMode = editMode;
        this.displayModal = 'block';

        this.checkForPrimaryContactPerson();

        if(!this.hasPrimaryContactPerson) {
            (<FormControl>this.form.controls['primary_contactperson']).updateValue('YES');
        }

        if(this.hasPrimaryContactPerson) {
            (<FormControl>this.form.controls['primary_contactperson']).updateValue('NO');
        }

        if(editMode) {
            this.user = _.clone(user);
            this.userTemp = _.clone(user);

            if(this.user.primary_contactperson) {
                (<FormControl>this.form.controls['primary_contactperson']).updateValue('YES');
            }

            if(!this.user.primary_contactperson) {
                (<FormControl>this.form.controls['primary_contactperson']).updateValue('NO');
            }
        }
    }
    
    private closeModal(): void {
        this.displayModal = 'none';
        this.user = new User();
        this.resetValidation();
    }
    
    private addUser(): void {
        this.isValidForm = true;

        if(this.form.valid && this.isValidForm) {
            let isUniqueEmail = this.checkForUniqueEmail(this.user);

            if(isUniqueEmail) {
                if(this.hasPrimaryContactPerson && !(this.user.primary_contactperson == 'NO')) {
                    (<FormControl>this.form.controls['primary_contactperson']).updateValue('NO');
                }

                if(this.form.controls['primary_contactperson'].value == 'YES') {
                    this.user.primary_contactperson = true;
                }

                if(this.form.controls['primary_contactperson'].value == 'NO') {
                    this.user.primary_contactperson = false;
                }

                this.users.push(this.user);
                this.updated.emit(this.users);
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
        this.updated.emit(this.users);
    }

    private editUser(): void {
        if(this.form.valid && this.isValidForm) {
            let isUniqueEmail = this.checkForUniqueEmail(this.user);

            if(isUniqueEmail) {
                if(this.hasPrimaryContactPerson && !(this.user.primary_contactperson == 'NO')) {
                    (<FormControl>this.form.controls['primary_contactperson']).updateValue('NO');
                }

                if(this.form.controls['primary_contactperson'].value == 'YES') {
                    this.user.primary_contactperson = true;
                }

                if(this.form.controls['primary_contactperson'].value == 'NO') {
                    this.user.primary_contactperson = false;
                }

                this.removeUser(this.userTemp);
                this.users.push(this.user);
                this.updated.emit(this.users);
                this.closeModal();
            } else {
                this.hasUniqueEmails = false;
            }
        } else {
            this.isValidForm = false;
        }
    }

    private checkForUniqueEmail(user: User) {
        let index = _.findIndex(this.users, ['email_address', user.email_address]);

        if (this.userTemp) {
            return index < 0 || this.userTemp.email_address == this.user.email_address;
        }

        return index < 0;
    }

    private checkForPrimaryContactPerson() {
        let index = _.findIndex(this.users, ['primary_contactperson', true]);
        this.hasPrimaryContactPerson = index > -1;
    }

    private resetValidation() {
        this.hasUniqueEmails = true;
        this.isValidForm = true;
    }
}