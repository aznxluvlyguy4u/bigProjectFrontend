import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {FormBuilder, ControlGroup} from "@angular/common";
import {REACTIVE_FORM_DIRECTIVES} from "@angular/forms";

@Component({
    directives: [REACTIVE_FORM_DIRECTIVES],
    templateUrl: '/app/main/cms/cms.component.html',
    pipes: [TranslatePipe]
})

export class CMSComponent {

    private form: ControlGroup;
    
    constructor(private fb: FormBuilder) {
        this.form = fb.group({
            dashboard: [''],
            contact_information: ['']
        });
    }
    
    private save() {}
}
