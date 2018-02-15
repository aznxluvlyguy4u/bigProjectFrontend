import { Injectable } from '@angular/core';
import { NSFOService } from '../nsfo/nsfo.service';
import { Client } from '../../../main/client/client.model';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ClientsStorage {

	clients: Client[] = [];

	clientsChanged = new Subject<Client[]>();

	constructor(private nsfo: NSFOService) {}

	initialize() {
		if (this.clients.length === 0) {
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
					this.clients = <Client[]> res.result;
					this.notifyClientsChanged();
				}
			);
	}

	private notifyClientsChanged() {
		this.clientsChanged.next(this.clients);
	}
}