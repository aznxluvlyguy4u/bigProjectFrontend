import {TranslatePipe} from "ng2-translate/ng2-translate";
import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {InvoiceSenderDetails} from "../../config.model";
import {Address} from "../../config.model";
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES, Validators} from "@angular/forms";
import {NSFOService} from "../../../../global/services/nsfo/nsfo.service";

@Component({
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
    template: require('./details.invoices.html'),
    pipes: [TranslatePipe]
})

export class InvoicesNSFODetailsComponent {
    private form: FormGroup;
    private invoiceSenderDetails: InvoiceSenderDetails = new InvoiceSenderDetails();
    private details: InvoiceSenderDetails[] = [];
    private senderAddress: Address = new Address();

    constructor(private fb: FormBuilder, private nsfo: NSFOService) {

        this.getInvoiceSenderDetails();
        this.form = fb.group({
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

    private getInvoiceSenderDetails(){
        this.nsfo.doGetRequest(this.nsfo.URI_INVOICE_SENDER_DETAILS).subscribe(
            res => {
                console.log(res);
                this.details = res.result;
                for (let detail of this.details){
                    console.log(detail);
                    this.invoiceSenderDetails = detail;
                    this.senderAddress = detail.address;
                    console.log(this.senderAddress);
                    console.log(this.invoiceSenderDetails);
                }
                this.invoiceSenderDetails = res.result[0];
                if (this.invoiceSenderDetails.address.suffix == undefined) {
                    this.invoiceSenderDetails.address.suffix = "";
                }

            }
        );
    }

    private CreateInvoiceSenderDetails(){
            this.invoiceSenderDetails.address = this.senderAddress;
            this.nsfo.doPostRequest(this.nsfo.URI_INVOICE_SENDER_DETAILS , this.form);
    }

    private UpdateInvoiceSenderDetails(){
            this.nsfo.doPutRequest(this.nsfo.URI_INVOICE_SENDER_DETAILS + "/" + this.invoiceSenderDetails.id.toString() , this.invoiceSenderDetails)
                .subscribe(
                res => {
                    console.log(res);
                    this.invoiceSenderDetails = res.result;
                }
            );
    }
}
