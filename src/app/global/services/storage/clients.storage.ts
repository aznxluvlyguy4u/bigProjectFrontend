import { Injectable } from '@angular/core';
import { NSFOService } from '../nsfo/nsfo.service';
import { Client } from '../../../main/client/client.model';
import { Subject } from 'rxjs/Subject';

import _ = require('lodash');

@Injectable()
export class ClientsStorage {

	clients: Client[] = [];

	clientsChanged = new Subject<Client[]>();

	constructor(private nsfo: NSFOService) {}

	isInitialized(): boolean {
		return this.clients.length > 0;
	}

	initialize() {
		if (!this.isInitialized()) {
			this.refresh();
		}
	}

	refresh() {
		this.doGetClientList();
	}

	private doGetClientList() {
		this.nsfo.doGetRequest(this.nsfo.URI_CLIENTS)
			.subscribe(
				res => {
					this.clients = this.cleanClientsListFormatting(<Client[]> res.result);
					this.notifyClientsChanged();
				}
			);
	}

	private notifyClientsChanged() {
		this.clientsChanged.next(this.clients);
	}

	private cleanClientsListFormatting(clients: Client[]): Client[] {
		for(let client of clients) {
			if (client.subscription_date === '') {
				client.subscription_date = undefined;
			}
		}
		return clients;
	}

	getUpdatedClient(client: Client): Client {
		return _.find(this.clients, {company_id: client.company_id})
	}

}