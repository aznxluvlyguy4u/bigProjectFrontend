import { TranslatePipe, TranslateService } from 'ng2-translate/ng2-translate';
import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import { InvoiceSenderDetails } from '../../../invoice/invoice.model';
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES, Validators} from "@angular/forms";
import {NSFOService} from "../../../../global/services/nsfo/nsfo.service";
import { Address } from '../../../client/client.model';
import { CountrySelectorComponent } from '../../../../global/components/countryselector/country-selector.component';
import { SpinnerComponent } from '../../../../global/components/spinner/spinner.component';

@Component({
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, CountrySelectorComponent, SpinnerComponent],
    template: require('./details.invoices.html'),
    pipes: [TranslatePipe]
})

export class InvoicesNSFODetailsComponent {
    private form: FormGroup;
    private editText;
    private invoiceSenderDetails: InvoiceSenderDetails = new InvoiceSenderDetails();
    private details: InvoiceSenderDetails[] = [];
    private senderAddress: Address = new Address();
    isUpdating: boolean;
    displayingSaveConfirmation: boolean;

    constructor(private fb: FormBuilder, private nsfo: NSFOService, private translate: TranslateService) {
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
            city: ['', Validators.required],
            payment_deadline: ['', Validators.required],
            company_name: ['', Validators.required],
        });
        this.isUpdating = false;
        this.displayingSaveConfirmation = false;
    }

    ngAfterViewInit() {
        this.editText = document.getElementById("result-text");
    }

    getInvoiceSenderDetails(){
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
                
            },
            error => {
                alert(this.nsfo.getErrorMessage(error));
            }

        );
    }

    CreateInvoiceSenderDetails(){
            while (this.editText.firstChild) {
                this.removeSaveConfirmationText();
            }
            this.isUpdating = true;
            this.invoiceSenderDetails.address = this.senderAddress;
            this.nsfo.doPostRequest(this.nsfo.URI_INVOICE_SENDER_DETAILS , this.invoiceSenderDetails).subscribe(
                res => {
                    this.invoiceSenderDetails = res.result;
                    this.isUpdating = false;
                    this.displaySaveConfirmationText();
                },
              error => {
                  alert(this.nsfo.getErrorMessage(error));
								  this.isUpdating = false;
              }
            );
    }

    private displaySaveConfirmationText() {
			this.editText.appendChild(document.createTextNode(this.translate.instant("YOUR CHANGES HAVE BEEN SAVED")));
			this.displayingSaveConfirmation = true;
			setTimeout(() => {
				this.removeSaveConfirmationText();
			}, 3 * 1000);
    }

    private removeSaveConfirmationText() {
      if (this.editText) {
				  this.editText.removeChild(this.editText.firstChild);
      }
			this.displayingSaveConfirmation = false;
    }

    UpdateInvoiceSenderDetails(){
        this.invoiceSenderDetails.address = this.senderAddress;
            this.nsfo.doPutRequest(this.nsfo.URI_INVOICE_SENDER_DETAILS + "/" + this.invoiceSenderDetails.id.toString() , this.invoiceSenderDetails)
                .subscribe(
                res => {
                    this.invoiceSenderDetails = res.result;
                },
									error => {
										  alert(this.nsfo.getErrorMessage(error));
									}
            );
    }
}
