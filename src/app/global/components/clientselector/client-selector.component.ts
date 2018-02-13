import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { SpinnerComponent } from '../spinner/spinner.component';
import { Client, Location } from '../../../main/client/client.model';
import { ClientsStorage } from '../../services/storage/clients.storage';
import { ClientFilterPipe } from '../../../main/client/overview/pipes/clientFilter.pipe';
import { PaginationComponent } from '../pagination/pagination.component';
import { PaginatePipe, PaginationService } from 'ng2-pagination';
import { NSFOService } from '../../services/nsfo/nsfo.service';

@Component({
	selector: 'app-client-selector',
	template: require('./client-selector.component.html'),
	directives: [SpinnerComponent, PaginationComponent],
	providers: [PaginationService],
	pipes: [TranslatePipe, ClientFilterPipe, PaginatePipe]
})
export class ClientSelectorComponent implements OnInit {
	isLoaded: boolean;

	filterSearch: string;
	filterInvoices: string;
	filterAmount: number;

	displayModal: string;
	initialSelectedClient: Client;


	@Input() selectedClient: Client;
	@Input() selectedLocation: Location;
	@Input() disabled: boolean = false;

	isLoadedEvent = new EventEmitter<boolean>();

	constructor(private clientsStorage: ClientsStorage, private nsfo: NSFOService) {}

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

	getCompanyDetailsIncludingLocations(){
		if (this.selectedClient) {
			this.nsfo.doGetRequest(this.nsfo.URI_CLIENTS + "/" + this.selectedClient.company_id)
				.subscribe(
					res => {
						this.selectedClient = res.result;
					}
				);
		}
	}

	hasSelectedLocation(): boolean {
		return this.hasLocationWithData(this.selectedLocation);
	}

	hasLocations(): boolean {

		if (this.selectedClient && this.selectedClient.locations && this.selectedClient.locations.length > 0) {

			for(let location of this.selectedClient.locations) {

					if (this.hasLocationWithData(location) === false) {
						return false;
					}

			}
			return true;
		}

		return false;
	}

	private hasLocationWithData(location: Location): boolean {
		if (location == null || location.address == null || location.ubn == null) {
			return false;

		} else if (location.address.city == null
			|| location.address.street_name == null
			|| location.address.address_number == null
		) {
			return false;
		}
		return true;
	}

	isClientsEmpty(): boolean {
		return this.getClients().length === 0;
	}

	getClients(): Client[] {
		return this.clientsStorage.clients;
	}

	selectClient(client: Client) {
		this.selectedClient = client;
		this.getCompanyDetailsIncludingLocations();
	}

	buttonText(): string {
		if (this.selectedClient) {
			return this.selectedClient.company_name;
		}
		return 'SELECT COMPANY';
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
	}
}