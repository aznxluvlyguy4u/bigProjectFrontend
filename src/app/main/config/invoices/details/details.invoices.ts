import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES, Validators} from "@angular/forms";

@Component({
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
    template: require('./details.invoices.html'),
    pipes: [TranslatePipe]
})

export class InvoicesNSFODetailsComponent {
    private form: FormGroup;

    constructor(private fb: FormBuilder) {
        this.form = fb.group({
            iban: ['', Validators.required],
            kvk_number: ['', Validators.required],
            btw_number: ['', Validators.required],
            street_name: ['', Validators.required],
            street_number: ['', Validators.required],
            address_suffix: ['', Validators.required],
            postal_code: ['', Validators.required],
            payment_deadline: ['', Validators.required]
        });
    }
}
