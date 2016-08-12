import {FormGroup} from "@angular/forms";

interface ValidationResult {
    [key:string]:boolean;
}

export class PasswordValidator {
    static validatePassword(group: FormGroup): ValidationResult {
        if(group.controls["password"].value == group.controls["repeat_password"].value) {
            return null
        }

        return {"invalidPassword":  true};
    }
}