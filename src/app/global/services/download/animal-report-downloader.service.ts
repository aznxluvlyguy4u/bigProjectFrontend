import { Animal } from '../../components/livestock/livestock.model';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class AnimalReportDownloaderService {

	public animals: Animal[] = [];

	isModalActive = new Subject<boolean>();

	public openModal() {
		this.updateModalNotificationStatus(true);
	}

	public closeModal() {
		this.updateModalNotificationStatus(false);
	}

	private updateModalNotificationStatus(openModal: boolean) {
		this.isModalActive.next(openModal);
	}

}