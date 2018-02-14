import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {InvoiceSenderDetails} from "../../config.model";
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES, Validators} from "@angular/forms";
import {NSFOService} from "../../../../global/services/nsfo/nsfo.service";
import { Address } from '../../../client/client.model';

@Component({
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
    template: require('./details.invoices.html'),
    pipes: [TranslatePipe]
})

export class InvoicesNSFODetailsComponent {
    private form: FormGroup;
    private editText;
    private invoiceSenderDetails: InvoiceSenderDetails = new InvoiceSenderDetails();
    private details: InvoiceSenderDetails[] = [];
    private senderAddress: Address = new Address();

    constructor(private fb: FormBuilder, private nsfo: NSFOService) {
        this.getInvoiceSenderDetails();
        this.form = fb.group({
            name: ['', Validators.required],
            iban: ['', Validators.required],
            kvk_number: ['', Validators.required],
            btw_number: ['', Validators.required],
            street_name: ['', Validators.required],
            address_number: ['', Validators.required],
            suffix: ['', Validators.required],
            postal_code: ['', Validators.required],
            payment_deadline: ['', Validators.required],
            company_name: ['', Validators.required],
        });
    }

    ngAfterViewInit() {
        this.editText = document.getElementById("result-text");
    }

    private getInvoiceSenderDetails(){
        let details = new InvoiceSenderDetails();
        this.nsfo.doGetRequest(this.nsfo.URI_INVOICE_SENDER_DETAILS).subscribe(
            res => {
                details = res.result;
                if (details != undefined && details.address.address_number_suffix == undefined) {
                    details.address.address_number_suffix = "";
                }
                if(details != undefined) {
                    this.senderAddress = res.result.address;
                    this.invoiceSenderDetails = res.result;
                    this.invoiceSenderDetails.address = this.senderAddress;
                }
                
            }
        );
    }

    private CreateInvoiceSenderDetails(){
            while (this.editText.firstChild) {
                this.editText.removeChild(this.editText.firstChild);
            }
            this.invoiceSenderDetails.address = this.senderAddress;
            this.nsfo.doPostRequest(this.nsfo.URI_INVOICE_SENDER_DETAILS , this.invoiceSenderDetails).subscribe(
                res => {
                    this.invoiceSenderDetails = res.result;
                    this.editText.appendChild(document.createTextNode("Uw wijzigingen zijn opgeslagen"));
                }
            );
    }

    private UpdateInvoiceSenderDetails(){
        this.invoiceSenderDetails.address = this.senderAddress;
            this.nsfo.doPutRequest(this.nsfo.URI_INVOICE_SENDER_DETAILS + "/" + this.invoiceSenderDetails.id.toString() , this.invoiceSenderDetails)
                .subscribe(
                res => {
                    this.invoiceSenderDetails = res.result;
                }
            );
    }
}
