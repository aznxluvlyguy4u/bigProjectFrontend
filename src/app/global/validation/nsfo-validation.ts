import moment = require("moment");
import {Control, ControlGroup} from "@angular/common";
import {Constants} from "../../index.constant";
import {SettingsService} from "../services/settings/settings.service";

interface ValidationResult {
    [key:string]:boolean;
}

export class UBNValidator {
    static isImportAnimal(group: ControlGroup): ValidationResult {
        if(group.controls["import_flag"].value == 'NO') {
            if(group.controls["ubn_previous_owner"].value.trim() != '') {
                return null
            }
        }

        if(group.controls["import_flag"].value == 'YES') {
            if(group.controls["ubn_previous_owner"].value.trim() == '') {
                return null;
            }
        }

        return {"isNotImportAnimal": true};
    }

    static isExportAnimal(group: ControlGroup): ValidationResult {
        if (group.controls["export_flag"].value == 'NO') {
            if (group.controls["ubn_new_owner"].value.trim() != '') {
                return null
            }
        }

        if (group.controls["export_flag"].value == 'YES') {
            // if (group.controls["ubn_new_owner"].value.trim() == '') {
                return null;
            // }
        }
        return {"isNotExportAnimal": true};
    }

    static validateWithSevenTest(control:Control): ValidationResult {
        let ubn_number: string = "";

        if (control.value) {
            ubn_number = control.value;
        }

        if (ubn_number.length == 7) {
            let chars = ubn_number.split('');
            let calc_values = [1, 7, 3, 1, 7, 3, 1];
            let sum = 0;

            for (let i = 0; i < chars.length; i++) {
                sum = sum + (parseInt(chars[i]) * calc_values[i]);
            }

            if ((sum / 10) % 1 == 0) {
                return null
            }
        }

        if (ubn_number.length == 0) {
            return null
        }

        return {"validateWithSevenTest": true};
    }
}

export class DateValidator {
    static validateDateFormat(control:Control): ValidationResult {
        let date = moment(control.value, 'DD-MM-YYYY');
        if (date._d != 'Invalid Date') {
            return null
        }
        return {"invalidDateFormat":  true};
    }

    static validateDateIsNotInTheFuture(control:Control): ValidationResult {
        let today = moment().utc();
        let diff = moment(control.value).utc().diff(today, 'minutes');
        if(diff <= 0)
        {
            return null;
        }
        return {"invalidDateItIsInTheFuture":  true};
    }
}

export class LitterValidator {
    static validateLitterSizeNotGreaterThenAlive(group: ControlGroup): ValidationResult {
        if (group.controls["litter_size"].value >= group.controls["litter_alive"].value) {
            return null
        }

        return {"invalidLitterSizeGreaterThenAlive":  true};
    }

    static validateLitterSizeNotGreaterThenSeven(group: ControlGroup): ValidationResult {
         if(group.controls["litter_size"].value <= 7 )
         {
            return null
         }

         return {"invalidLitterSizeGreaterThenSeven":  true};
         
    }

    // static validateLitterSizeRequired(group: ControlGroup): ValidationResult {
    //      if((group.controls["litter_size"].value == "")
    //      {
    //         return {"invalidLitterSizeRequired":  true};
    //      }

    //      return null
    // }
}

export class TailValidator {
    static TailLengthNotGreaterThen29point9(control:Control): ValidationResult {
        if( control.value <= 29.9 ) {
            return null;
        }

        return {"invalidTailLengthGreaterThen29point9" :true};
    }
}

export class WeightValidator {
    static WeightNotGreaterThen9point9(control:Control): ValidationResult {
        if( control.value <= 9.9) {
            return null;
        }

        return {"invalidWeightGreaterThen9Point9" :true};
    }

    static WeightNotLessThenOr0(control:Control): ValidationResult {
        if( control.value > 0 && control.value != 0 ) {
            return null;
        }

        return {"invalidWeightNotLessThenOr0" :true};
    }
}
export class PasswordValidator {
    static validatePassword(group: ControlGroup): ValidationResult {
        if(group.controls["password"].value == group.controls["repeat_password"].value) {
            return null
        }

        return {"invalidPassword":  true};
    }
}


export class ExteriorMeasurementsValidator {
    static validateMeasurementValue(control:Control): ValidationResult {
        if ((control.value >= 69 && control.value <= 99) || control.value == 0) {
            return null
        }
        
        return {"invalidExteriorMeasurement":  true};
    }

    // TODO : Find out exact minimum 
    static validateMeasurementValueBetween0And99(control:Control): ValidationResult {
        if ((control.value > 0 && control.value <= 99) || control.value == 0) {
            return null
        }
        
        return {"invalidExteriorMeasurementBetween0And99":  true};
    }
}

