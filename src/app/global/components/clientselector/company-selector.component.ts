import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Client } from '../../../main/client/client.model';
import { ClientsStorage } from '../../services/storage/clients.storage';
import { ClientFilterPipe } from '../../../main/client/overview/pipes/clientFilter.pipe';
import { PaginationComponent } from '../pagination/pagination.component';
import { PaginatePipe, PaginationService } from 'ng2-pagination';
import { Router } from '@angular/router';

@Component({
	selector: 'app-company-selector',
	template: require('./company-selector.component.html'),
	directives: [SpinnerComponent, PaginationComponent],
	providers: [PaginationService],
	pipes: [TranslatePipe, ClientFilterPipe, PaginatePipe]
})
export class CompanySelectorComponent implements OnInit {
	isLoaded: boolean;

	filterSearch: string;
	filterInvoices: string;
	filterAmount: number;

	displayModal: string;
	initialSelectedClient: Client;


	@Input() selectedClient: Client;
	@Input() disabled: boolean = false;
	@Output() selectedClientChanged = new EventEmitter<Client>();

	isLoadedEvent = new EventEmitter<boolean>();

	constructor(private clientsStorage: ClientsStorage, private router: Router) {}

	ngOnInit() {
		this.setInitialValues();
		this.initialSelectedClient = this.selectedClient;

		if (this.clientsStorage.clients.length === 0) {

			this.clientsStorage.clientsChanged.takeLast(1)
				.subscribe(
					res => {
						this.isLoaded = true;
						this.isLoadedEvent.emit(true);
					},
					error => {
						alert('ERROR RELOADING CLIENTS');
					}
				);
		}

		this.clientsStorage.refresh();
	}

	private setInitialValues() {
		this.displayModal = 'none';
		this.filterSearch = '';
		this.filterInvoices = 'ALL';
		this.filterAmount = 5;
	}

	navigateTo(url: string) {
		this.router.navigate([url]);
	}

	navigateToEditSelectedClient() {
		if(this.selectedClient == null) {
			alert('NO COMPANY WAS SELECTED');
			return;
		}

		if(this.selectedClient.company_id == null) {
			alert('THE SELECTED COMPANY HAS NO COMPANY_ID');
			return;
		}

		this.navigateTo("/client/dossier/edit/" + this.selectedClient.company_id);
	}

	hasSelectedClientWithBillingAddress(): boolean {
		return this.selectedClient != null
			&& this.selectedClient.billing_address != null
			&& this.selectedClient.billing_address.address_number != null
			&& this.selectedClient.billing_address.street_name != null
			&& this.selectedClient.billing_address.city != null
			&& this.selectedClient.billing_address.postal_code != null
		;
	}

	billingAddressText() {
		if (this.selectedClient == null || this.selectedClient.billing_address == null) {
			return '';
		}

		return this.selectedClient.billing_address.street_name + ' '
			+ this.selectedClient.billing_address.address_number + ' '
			+ (this.selectedClient.billing_address.address_number_suffix != null ? this.selectedClient.billing_address.address_number_suffix + ' ' : '') +', '
			+ this.selectedClient.billing_address.postal_code + ', '
			+ this.selectedClient.billing_address.city
	}

	isClientsEmpty(): boolean {
		return this.getClients().length === 0;
	}

	getClients(): Client[] {
		return this.clientsStorage.clients;
	}

	selectClient(client: Client) {
		this.selectedClient = client;
		this.clickOK();
	}

	buttonText(): string {
		if (this.selectedClient) {
			return this.selectedClient.company_name;
		}
		return 'SELECT COMPANY';
	}

	clientName(): string {
		return this.selectedClient ? this.selectedClient.company_name : '';
	}

	openModal() {
		this.displayModal = 'block';
	}

	closeModal() {
		this.displayModal = 'none';
		this.setInitialValues();
	}

	clickCancel() {
		this.closeModal();
		this.selectedClient = this.initialSelectedClient;
	}

	clickOK() {
		this.closeModal();
		this.initialSelectedClient = this.selectedClient;
		this.notifySelectedClientChanged();
	}

	notifySelectedClientChanged() {
		this.selectedClientChanged.emit(this.selectedClient);
	}
}