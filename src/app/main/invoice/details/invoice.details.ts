import {Component} from "@angular/core";
import moment = require('moment');
import {Subscription} from "rxjs/Rx";
import {Router, ActivatedRoute, ROUTER_DIRECTIVES} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES, Validators} from "@angular/forms";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {
	Invoice, InvoiceSenderDetails, InvoiceRule, InvoiceRuleSelection
} from '../invoice.model';
import { CompanySelectorComponent } from '../../../global/components/clientselector/company-selector.component';
import { Address, Client } from '../../client/client.model';
import { SettingsService } from '../../../global/services/settings/settings.service';
import { LedgerCategoryDropdownComponent } from '../../../global/components/ledgercategorydropdown/ledger-category-dropdown.component';
import { FormatService } from '../../../global/services/utils/format.service';
import { ClientsStorage } from '../../../global/services/storage/clients.storage';
import { StandardInvoiceRuleSelectorComponent } from '../../../global/components/standardinvoiceruleselector/standard-invoice-rule-selector.component';
import { LocalNumberFormat } from '../../../global/pipes/local-number-format';
import {Datepicker} from "../../../global/components/datepicker/datepicker.component";
import {DownloadService} from "../../../global/services/download/download.service";

@Component({
    selector: 'ng-select',
    properties: [
        'allowClear',
        'placeholder',
        'items',
        'multiple',
        'showSearchInputInDropdown'
    ],
    directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, CompanySelectorComponent,
			LedgerCategoryDropdownComponent, Datepicker, StandardInvoiceRuleSelectorComponent],
    template: require('./invoice.details.html'),
    pipes: [TranslatePipe, LocalNumberFormat]
})



export class InvoiceDetailsComponent {
		private urlInvoiceOverview = '/invoice';


    private dataSub: Subscription;
    private senderDetails: InvoiceSenderDetails = new InvoiceSenderDetails();
    private pageTitle: string;
    private pageMode: string;
    private invoiceId: number;
    private selectedUbn: string;
    private form1: FormGroup;
    private selectedCompany: Client;
    clientUbns: string[] = [];
    private selectedInvoiceRule: InvoiceRule;
    private temporaryRule: InvoiceRule;
    temporaryRuleAmount: number;
    temporaryRuleDate: string = moment().format(this.settings.getViewDateFormat());
	temporaryRuleDate2: string = moment().format(this.settings.getViewDateFormat());
    minRuleAmount = 1;
    private invoice: Invoice = new Invoice;
    private form: FormGroup;
    private onlyView: boolean = false;
    private companySelected: boolean = false;
	private model_datetime_format;
	private view_date_format;

    constructor(private fb: FormBuilder,
				private router: Router,
				private activatedRoute: ActivatedRoute,
				private downloadService: DownloadService,
				private nsfo: NSFOService,
				private settings: SettingsService,
				private clientStorage: ClientsStorage
	) {
        this.form = fb.group({
            description: ['', Validators.required],
            category: ['', Validators.required],
            price_excl_vat: ['', Validators.required],
            vat_percentage_rate: ['', Validators.required],
            amount: ['', Validators.required],
			date: ['', Validators.required]
        });
        this.form1 = fb.group({
			amount: ['', Validators.required],
			date: ['', Validators.required],
		});
		this.model_datetime_format = settings.getModelDateTimeFormat();
		this.view_date_format = settings.getViewDateFormat();
    }

    ngOnInit() {
    		this.initializeNewTempInvoiceRuleValues();
        this.dataSub = this.activatedRoute.params.subscribe(params => {
            this.pageMode = params['mode'];
            if(this.isEditMode()) {
                this.pageTitle = 'EDIT INVOICE';
                this.invoiceId = params['id'];
                this.nsfo.doGetRequest(this.nsfo.URI_INVOICE + "/" + this.invoiceId)
                    .subscribe(res => {
                        this.invoice = res.result;
                        if (this.invoice.company != null) {
                        	this.companySelected = true;
						}
                        this.selectedCompany = this.invoice.company;
												this.updateInvoiceDataInVariables();
												this.updateClientUbns();
                    },
											error => {
												alert(this.nsfo.getErrorMessage(error));
											}
                    );
            }

            if(this.isCreateMode()) {
							  this.pageTitle = 'NEW INVOICE';
							  this.selectedCompany = null;
							  this.selectedUbn = null;
							  this.getSenderDetailsAndInitializeNewInvoice();
            }

            if (this.isViewMode()) {
                this.pageTitle = 'VIEW INVOICE';
                this.invoiceId = params['id'];
                this.nsfo.doGetRequest(this.nsfo.URI_INVOICE + "/" + this.invoiceId)
                    .subscribe(res => {
                        this.invoice = res.result;
                        if (this.invoice.ubn != null) {
                        	this.companySelected = true;
						}
						this.updateInvoiceDataInVariables();
                        },
                          error => {
                            alert(this.nsfo.getErrorMessage(error));
                          }
											);
                this.onlyView = true;
            }
        });
    }

    isCreateMode() {
    	return this.pageMode == 'new';
		}

		isEditMode() {
			return this.pageMode == 'edit';
		}

		isViewMode() {
			return this.pageMode == 'view';
		}

		private updateInvoiceDataInVariables() {
			this.senderDetails = this.invoice.sender_details;
			this.selectedCompany = this.invoice.company;
			this.selectedUbn = this.invoice.ubn;
		}

	private getSenderDetailsAndInitializeNewInvoice() {
		let details = new InvoiceSenderDetails();
		let address = new Address();
		this.nsfo.doGetRequest(this.nsfo.URI_INVOICE_SENDER_DETAILS)
			.subscribe(
				res => {
					this.senderDetails = res.result;
					this.initializeNewInvoice();
				},
				error => {
					alert(this.nsfo.getErrorMessage(error));
				}
			);
	}

	private initializeNewTempInvoiceRuleValues() {
    	this.temporaryRuleAmount = 1;
    	this.temporaryRule = new InvoiceRule();
	}

	private initializeNewInvoice() {
		this.invoice.status = "INCOMPLETE";
		this.invoice.sender_details = this.senderDetails;

		this.nsfo.doPostRequest(this.nsfo.URI_INVOICE, this.invoice)
			.subscribe(
				res => {
					this.invoice = res.result;
					this.invoiceId = this.invoice.id;
					this.updateInvoiceDataInVariables();
					this.updateClientUbns();
				},
				error => {
					alert(this.nsfo.getErrorMessage(error));

					if (error.json().result.message === 'SENDER DETAILS ARE MISSING') {
						this.navigateToInvoiceSenderDetailsEdit();
					} else {
						this.router.navigate([this.urlInvoiceOverview]);
					}
				}
			);
  }

  private updateInvoiceClientAndUbn() {
    	if (this.invoice.id === null) {

		}
    	this.invoice.company = this.selectedCompany;
    	this.invoice.ubn = this.selectedUbn;
    	this.nsfo.doPutRequest(this.nsfo.URI_INVOICE + "/" + this.invoice.id, this.invoice)
			.subscribe(
				res => {
					this.invoice = res.result;
					this.companySelected = true;
				},
				error => {
					alert(this.nsfo.getErrorMessage(error));

					if (error.json().result.message === 'SENDER DETAILS ARE MISSING') {
						this.navigateToInvoiceSenderDetailsEdit();
					} else {
						this.router.navigate([this.urlInvoiceOverview]);
					}
				}
			)
  }

	refreshSenderDetails() {
		this.nsfo.doGetRequest(this.nsfo.URI_INVOICE_SENDER_DETAILS)
			.subscribe(
				res => {
					this.senderDetails = res.result;
				},
				error => {
					alert(this.nsfo.getErrorMessage(error));
				}
			);
	}


	areClientsInitialized(): boolean {
    	return this.clientStorage.isInitialized();
	}

	refreshCustomerDetails() {
    	if (this.areClientsInitialized()) {
					this.invoice.company = this.clientStorage.getUpdatedClient(this.invoice.company);
					const company = this.invoice.company;

					if (!(company.locations && company.locations.indexOf(this.invoice.ubn) !== -1)) {
							this.invoice.ubn = undefined;
					}

					this.invoice.company_name = company.company_name;
					this.invoice.company_debtor_number = company.debtor_number;
					this.invoice.company_vat_number = company.vat_number;
			}
	}

	hasSelectedClientWithCompanyId(): boolean {
    	return this.invoice.company && this.invoice.company.company_id != null;
	}

	navigateToEditSelectedClient() {
		if(this.invoice.company == null) {
			alert('NO COMPANY WAS SELECTED');
			return;
		}

		if(this.invoice.company.company_id == null) {
			alert('THE SELECTED COMPANY HAS NO COMPANY_ID');
			return;
		}

		this.navigateTo("/client/dossier/edit/" + this.invoice.company.company_id);
	}

	hasClientAndUbn(): boolean {
    	return this.selectedCompany != null
				&& this.selectedUbn != null;
	}

	isCustomInvoiceRuleCreateButtonActive(): boolean {
    	return this.temporaryRule != null
					&& this.temporaryRule.description != null
					&& this.temporaryRule.vat_percentage_rate != null
					&& this.temporaryRule.price_excl_vat != null
					&& this.temporaryRule.ledger_category != null
					&& this.temporaryRule.ledger_category.id != null
					&& this.tempRulePriceExclVatDecimalCountIsValid()
					&& this.tempRuleAmountDecimalCountIsValid()
					&& this.ruleAmountIsAboveAllowedMinimum()
			;
	}

	tempRuleAmountDecimalCountIsValid(): boolean {
    	if (this.temporaryRuleAmount == null) {
    		return false;
			}
		return FormatService.isInteger(this.temporaryRuleAmount);
	}

	ruleAmountIsAboveAllowedMinimum(): boolean {
    	return this.temporaryRuleAmount >= this.minRuleAmount;
	}

	tempRulePriceExclVatDecimalCountIsValid(): boolean {
    	return InvoiceDetailsComponent.priceExclVatDecimalCountIsValid(this.temporaryRule.price_excl_vat);
	}

	static priceExclVatDecimalCountIsValid(priceExclVat: number) {
    	return FormatService.doesNotExceedMaxCurrencyDecimalCount(priceExclVat);
	}
    
    private addInvoiceRule(type): void {
		let dateString;
		let dateFormat;
        let rule = new InvoiceRule();
        rule.type = "custom";
        rule.sort_order = 1;

        if (type == "standard") {
			dateString = moment(this.form1.controls["date"].value, this.settings.getViewDateFormat());
			dateFormat = dateString.format(this.settings.getModelDateTimeFormat());
						rule.type = type;
						rule = this.selectedInvoiceRule;
        } else {
			dateString = moment(this.form.controls["date"].value, this.settings.getViewDateFormat());
			dateFormat = dateString.format(this.settings.getModelDateTimeFormat());
            rule.sort_order = 1;
            rule.ledger_category = this.temporaryRule.ledger_category;
            rule.vat_percentage_rate = this.temporaryRule.vat_percentage_rate;
            rule.price_excl_vat = this.temporaryRule.price_excl_vat;
            rule.description = this.temporaryRule.description;
        }

		let ruleSelection = new InvoiceRuleSelection();
        ruleSelection.invoice_rule = rule;
        ruleSelection.amount = this.temporaryRuleAmount;
		ruleSelection.date = dateFormat;
		console.log(dateFormat);
        this.postInvoiceRuleSelection(ruleSelection, type);
    }

    private removeInvoiceRule(invoiceRule: InvoiceRule): void {
        this.deleteInvoiceRule(invoiceRule);
    }

    private postInvoiceRuleSelection(newRuleSelection: InvoiceRuleSelection, type: String){
        this.nsfo
            .doPostRequest(this.nsfo.URI_INVOICE+ "/" + this.invoice.id + "/invoice-rule-selection", newRuleSelection)
            .subscribe(
                res => {
                    if (type !== "standard") {
											this.initializeNewTempInvoiceRuleValues();
                    } else {
											this.selectedInvoiceRule = null;
										}
					this.invoice = res.result;
                },
                  error => {
                    alert(this.nsfo.getErrorMessage(error));
                  }
            );
    }

    private deleteInvoiceRule(invoiceRule: InvoiceRule){

    		// Immediately remove in frontend to increase UX
    		let deletedInvoiceRuleSelection = this.removeInvoiceRuleFromInvoiceArray(invoiceRule);
    		if (deletedInvoiceRuleSelection == null) {
    			alert('NO RULE SELECTION FOUND FOR INVOICE RULE');
    			return;
				}

        this.nsfo
            .doDeleteRequest(this.nsfo.URI_INVOICE + "/" + this.invoice.id + "/invoice-rule-selection" + "/" + deletedInvoiceRuleSelection.id.toString(), "")
            .subscribe(
                res => {
                		this.invoice = res.result;
                },
                  error => {
                		this.invoice.invoice_rule_selections.push(deletedInvoiceRuleSelection);
                    alert(this.nsfo.getErrorMessage(error));
                  },
							() => {
                	deletedInvoiceRuleSelection = undefined;
							}
            );
    }

    private removeInvoiceRuleFromInvoiceArray(invoiceRule: InvoiceRule): InvoiceRuleSelection {

    	if (invoiceRule == null) {
    		return null;
			}

    	for(let invoiceRuleSelection of this.invoice.invoice_rule_selections) {

    		if (invoiceRuleSelection.invoice_rule
					&& invoiceRuleSelection.invoice_rule.id === invoiceRule.id
					&& invoiceRule.id != null)
    		{
						let index = this.invoice.invoice_rule_selections.indexOf(invoiceRuleSelection);
						this.invoice.invoice_rule_selections.splice(index, 1);
						return invoiceRuleSelection;
    		}
			}

			return null;
		}


    setInvoiceRecipient() {
        if (this.selectedCompany) {
					this.invoice.company = this.selectedCompany;
					this.invoice.company_id = this.selectedCompany.company_id;
					this.invoice.company_name = this.selectedCompany.company_name;
					this.invoice.company_vat_number = this.selectedCompany.vat_number;
					this.invoice.company_debtor_number = this.selectedCompany.debtor_number;

					if (this.selectedCompany.owner) {
					    const firstName = this.selectedCompany.owner.first_name != null && this.selectedCompany.owner.first_name != ''
                ? this.selectedCompany.owner.first_name + ' ' : '';
					    this.invoice.name = firstName + this.selectedCompany.owner.last_name;
          } else {
					    this.invoice.name = null;
          }

          // Remove selectedUbn if the old selectedUbn does not belong to the new selectedCompany
          if (this.selectedCompany.locations) {
			  let hasSelectedUbn = false;
			  for (let location of this.selectedCompany.locations) {
				  if (typeof location === 'string') {
					  if (location === this.selectedUbn) {
						  hasSelectedUbn = true;
						  break;
					  }
				  } else {
					  if (location.ubn != null && location.ubn === this.selectedUbn) {
						  hasSelectedUbn = true;
						  break;
					  }
				  }
			  }
			  if (!hasSelectedUbn) {
				  this.selectedUbn = null;
			  }

          } else {
				this.selectedUbn = null;
          }

        } else {
			this.invoice.company = null;
			this.invoice.company_id = null;
			this.invoice.company_name = null;
			this.invoice.company_vat_number = null;
			this.invoice.company_debtor_number = null;
			this.selectedUbn = null;
        }

        this.setInvoiceUbn();
        this.updateClientUbns();
    }

    setInvoiceUbn() {
			if (this.selectedUbn == null || this.selectedUbn == '' || this.selectedUbn == 'null') {
			  this.selectedUbn = null;
				this.invoice.ubn = null;
			} else {
				this.invoice.ubn = this.selectedUbn;
			}
    }

    updateClientUbns() {
			this.clientUbns = [];

			if (this.selectedCompany == null
        || this.selectedCompany.locations == null
        || this.selectedCompany.locations.length === 0) {
        return;
      }

			for(let location of this.selectedCompany.locations) {
			  if (typeof location === 'string') {
			    this.clientUbns.push(location);
        } else {
			    this.clientUbns.push(location.ubn);
        }
			}
    }

    private sendInvoiceToClient() {
        this.invoice.sender_details = this.senderDetails;
        this.invoice.status = "UNPAID";

        if (this.invoice.id) {
            this.nsfo.doPutRequest(this.nsfo.URI_INVOICE + "/" + this.invoice.id ,this.invoice)
                .subscribe(
                    res => {
                        this.navigateTo("/invoice");
                    },
                      error => {
                        alert(this.nsfo.getErrorMessage(error));
                      }
                );
        }
        else {
            this.nsfo.doPostRequest(this.nsfo.URI_INVOICE, this.invoice)
                .subscribe(
                    res => {
                        this.navigateTo("/invoice");
                    },
                      error => {
                        alert(this.nsfo.getErrorMessage(error));
                      }
                );
        }
    }

    private saveInvoice() {
        this.invoice.sender_details = this.senderDetails;
        this.invoice.status = "NOT SEND";

        if (!this.invoice.company_name) {
            this.invoice.status = "INCOMPLETE";
        }
        if (this.invoice.id !== null) {
            this.nsfo.doPutRequest(this.nsfo.URI_INVOICE + "/" + this.invoice.id, this.invoice)
                .subscribe(
                    res => {
                        this.navigateTo("/invoice");
                    },
                  error => {
                        alert(this.nsfo.getErrorMessage(error));
                    }
                );
        }
        else {
            this.nsfo.doPostRequest(this.nsfo.URI_INVOICE, this.invoice)
                .subscribe(
                    res => {
                        this.navigateTo("/invoice");
                    },
                      error => {
                        alert(this.nsfo.getErrorMessage(error));
                      }
                );
        }
    }

    public downloadPdf() {
    	this.downloadService.doInvoicePdfGetRequest(this.invoice);
	}

    private deleteInvoice() {
        this.nsfo.doDeleteRequest(this.nsfo.URI_INVOICE + "/" + this.invoiceId, this.invoice)
            .subscribe(
                res => {
                    this.navigateTo("/invoice");
                },
                  error => {
                    alert(this.nsfo.getErrorMessage(error));
                  }
            )
    }

    private navigateTo(url: string) {
        this.router.navigate([url]);
    }

    getVatPercentages(): number[] {
    	return this.settings.getVatPercentages();
		}

    navigateToInvoiceSenderDetailsEdit() {
      this.navigateTo('/configuration/invoices/invoices_details');
    }

    areSenderDetailsComplete(): boolean {
			return this.senderDetails != null &&
        this.senderDetails.id != null &&
        this.senderDetails.iban != null &&
        this.senderDetails.chamber_of_commerce_number != null &&
        this.senderDetails.vat_number != null &&
        this.senderDetails.payment_deadline_in_days != null &&
        this.senderDetails.name != null &&
        this.senderDetails.address != null &&
        this.senderDetails.address.street_name != null &&
        this.senderDetails.address.address_number != null &&
        this.senderDetails.address.postal_code != null &&
        this.senderDetails.address.city != null
      ;
    }

	private getToday() {
		moment().format(this.settings.getViewDateFormat());
	}
}