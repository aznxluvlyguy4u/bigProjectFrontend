import _ = require('lodash');
import {Component} from "@angular/core";
import {Subscription} from "rxjs/Rx";
import {Router, ActivatedRoute, ROUTER_DIRECTIVES} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {FormGroup, FormBuilder, REACTIVE_FORM_DIRECTIVES, Validators} from "@angular/forms";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {
	Invoice, InvoiceSenderDetails, InvoiceRule, InvoiceRuleSelection,
	VatCalculationGroup
} from '../invoice.model';
import { CompanySelectorComponent } from '../../../global/components/clientselector/company-selector.component';
import { Address, Client } from '../../client/client.model';
import { SettingsService } from '../../../global/services/settings/settings.service';
import { LedgerCategoryDropdownComponent } from '../../../global/components/ledgercategorydropdown/ledger-category-dropdown.component';
import { FormatService } from '../../../global/services/utils/format.service';
import { ClientsStorage } from '../../../global/services/storage/clients.storage';

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
			LedgerCategoryDropdownComponent],
    template: require('./invoice.details.html'),
    pipes: [TranslatePipe]
})

export class InvoiceDetailsComponent {
		private urlInvoiceOverview = '/invoice';

    private dataSub: Subscription;
    private senderDetails: InvoiceSenderDetails = new InvoiceSenderDetails();
    private pageTitle: string;
    private pageMode: string;
    private invoiceId: number;
    private selectedUbn: string;
    private selectedCompany: Client;
    clientUbns: string[] = [];
    private selectedInvoiceRuleId: number;
    private standardGeneralInvoiceRuleOptions: InvoiceRule[] = [];
    private temporaryRule: InvoiceRule;
    temporaryRuleAmount: number;
    minRuleAmount = 1;
    private invoice: Invoice = new Invoice;
    private form: FormGroup;
    private onlyView: boolean = false;
    private totalExclVAT: number = 0;
    private totalInclVAT: number = 0;
    private vatCalculations: VatCalculationGroup[] = [];

    constructor(private fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute,
								private nsfo: NSFOService, private settings: SettingsService, private clientStorage: ClientsStorage) {
        this.form = fb.group({
            description: ['', Validators.required],
            category: ['', Validators.required],
            price_excl_vat: ['', Validators.required],
            vat_percentage_rate: ['', Validators.required],
            amount: ['', Validators.required],
        });
    }

    ngOnInit() {
    		this.initializeNewTempInvoiceRuleValues();
        this.getGeneralInvoiceRulesOptions();
        this.dataSub = this.activatedRoute.params.subscribe(params => {
            this.pageMode = params['mode'];
            if(this.isEditMode()) {
                this.pageTitle = 'EDIT INVOICE';
                this.invoiceId = params['id'];
                this.nsfo.doGetRequest(this.nsfo.URI_INVOICE + "/" + this.invoiceId)
                    .subscribe(res => {
                        this.invoice = res.result;
                        this.selectedCompany = this.invoice.company;
												this.updateInvoiceDataInVariables();
												this.updateClientUbns();
                        this.doVATCalculations();
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
												this.updateInvoiceDataInVariables();
                        this.doVATCalculations();
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
					this.router.navigate([this.urlInvoiceOverview]);
				}
			);
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
    private getGeneralInvoiceRulesOptions(): void {
        this.nsfo.doGetRequest(this.nsfo.URI_INVOICE_RULE + "?category=GENERAL&type=standard")
            .subscribe(
                res => {
                    this.standardGeneralInvoiceRuleOptions = <InvoiceRule[]> res.result;
                },
                  error => {
                    alert(this.nsfo.getErrorMessage(error));
                  }
            )
    }
    
    private addInvoiceRule(type): void {
        let rule = new InvoiceRule();
        rule.type = "custom";
        rule.sort_order = 1;

        if (type == "standard") {
						rule.type = type;
            let selectedId = this.selectedInvoiceRuleId;
            if (this.selectedInvoiceRuleId) {
                let standardInvoiceRule = _.find(this.standardGeneralInvoiceRuleOptions, function (o) {
                    return o.id == selectedId;
                });

                rule.id = selectedId;
                rule.description = standardInvoiceRule.description;
                rule.vat_percentage_rate = standardInvoiceRule.vat_percentage_rate;
                rule.price_excl_vat = standardInvoiceRule.price_excl_vat;
                rule.ledger_category = standardInvoiceRule.ledger_category;
            }
        } else {
            rule.sort_order = 1;
            rule.ledger_category = this.temporaryRule.ledger_category;
            rule.vat_percentage_rate = this.temporaryRule.vat_percentage_rate;
            rule.price_excl_vat = this.temporaryRule.price_excl_vat;
            rule.description = this.temporaryRule.description;
        }

				let ruleSelection = new InvoiceRuleSelection();
        ruleSelection.invoice_rule = rule;
        ruleSelection.amount = this.temporaryRuleAmount;

        this.postInvoiceRuleSelection(ruleSelection, type);
        this.doVATCalculations();
    }

    private removeInvoiceRule(invoiceRule: InvoiceRule): void {
        this.deleteInvoiceRule(invoiceRule);
    }

    private doVATCalculations(): void {
        this.vatCalculations = [];
        this.totalExclVAT = 0;
        this.totalInclVAT = 0;

        for(let invoiceRuleSelection of this.invoice.invoice_rule_selections) {
        	if (invoiceRuleSelection.invoice_rule && invoiceRuleSelection.invoice_rule.vat_percentage_rate != 0) {
						let vatPercentageRate = invoiceRuleSelection.invoice_rule.vat_percentage_rate;
						let amount = invoiceRuleSelection.amount;
						let singlePriceExclVat = invoiceRuleSelection.invoice_rule.price_excl_vat;

						let priceExclVat = singlePriceExclVat * amount;
						let vat = priceExclVat * (vatPercentageRate/100);
						let priceInclVat = priceExclVat + vat;

						let vatCalculationGroup = _.find(this.vatCalculations, {vat_percentage_rate: vatPercentageRate});

						if (vatCalculationGroup != null) {
							vatCalculationGroup.price_excl_vat_total += priceExclVat;
							vatCalculationGroup.price_incl_vat_total += priceInclVat;
							vatCalculationGroup.vat += vat;
						} else {
							vatCalculationGroup = new VatCalculationGroup();
							vatCalculationGroup.vat_percentage_rate = vatPercentageRate;
							vatCalculationGroup.price_excl_vat_total = priceExclVat;
							vatCalculationGroup.price_incl_vat_total = priceInclVat;
							vatCalculationGroup.vat = vat;
							this.vatCalculations.push(vatCalculationGroup);
						}

						this.totalExclVAT += priceExclVat;
						this.totalInclVAT += priceInclVat;
					}
				}

				_.orderBy(this.vatCalculations, ['vat_percentage_rate'], ['desc']);

        this.totalInclVAT = FormatService.roundCurrency(this.totalInclVAT);
        this.invoice.total = this.totalInclVAT;
    }

    private postInvoiceRuleSelection(newRuleSelection: InvoiceRuleSelection, type: String){
        this.nsfo
            .doPostRequest(this.nsfo.URI_INVOICE+ "/" + this.invoice.id + "/invoice-rule-selection", newRuleSelection)
            .subscribe(
                res => {
                    if (type !== "standard") {
											this.initializeNewTempInvoiceRuleValues();
                    }
                    this.invoice.invoice_rule_selections.push(res.result);
                    this.doVATCalculations();
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

				this.doVATCalculations();

        this.nsfo
            .doDeleteRequest(this.nsfo.URI_INVOICE + "/" + this.invoice.id + "/invoice-rule-selection" + "/" + deletedInvoiceRuleSelection.id.toString(), "")
            .subscribe(
                res => {
                },
                  error => {
                		this.invoice.invoice_rule_selections.push(deletedInvoiceRuleSelection);
                		this.doVATCalculations();
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
        this.invoice.total = this.totalInclVAT;
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
        this.invoice.total = this.totalInclVAT;
        if (!this.invoice.company_name) {
            this.invoice.status = "INCOMPLETE";
        }
        if (this.pageMode == 'edit') {
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
}