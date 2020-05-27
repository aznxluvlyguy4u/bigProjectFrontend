import { Component, OnDestroy, OnInit } from '@angular/core';
import {TranslatePipe} from "ng2-translate/ng2-translate";
import { DownloadRequest } from '../../services/download/download-request.model';
import { DownloadService } from '../../services/download/download.service';
import { CSV, PDF } from '../../variables/file-type.enum';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-download-modal',
	template: require('./download-modal.component.html'),
	pipes: [TranslatePipe]
})
export class DownloadModalComponent implements OnInit, OnDestroy {
	private modalDisplay: string = 'none';

	public downloadRequestsShownInModal: DownloadRequest[];

	private downloadRequestSubscription: Subscription;
	private isModalActiveSubscription: Subscription;
	private toggleModalSubscription: Subscription;

	private onDestroy$: Subject<void> = new Subject<void>();

	constructor(private downloadService: DownloadService) {}


	ngOnInit() {
		this.downloadRequestSubscription = this.downloadService.downloadsShownInModalChanged
			.pipe(takeUntil(this.onDestroy$))
			.subscribe(
			(downloadRequests: DownloadRequest[]) => {
				this.downloadRequestsShownInModal = downloadRequests;
				this.closeIfEmpty();
			}
		);

		this.downloadRequestsShownInModal = this.downloadService.getDownloadRequestsShownInModal();

		this.isModalActiveSubscription = this.downloadService.isModalActive
			.pipe(takeUntil(this.onDestroy$))
			.subscribe(
			(notifyUser: boolean) => {
				if (notifyUser) {
					this.openModal();
				} else {
					this.closeModal();
				}
			}
		);

		this.toggleModalSubscription = this.downloadService.toggleIsModalActive
			.pipe(takeUntil(this.onDestroy$))
			.subscribe(
			(toggleModal: boolean) => {
					if (toggleModal) {
						this.toggleModal();
					}
			}
		)
	}

	closeIfEmpty() {
		if (this.downloadRequestsShownInModal.length === 0) {
				this.closeModal();
		}
	}

	ngOnDestroy() {
		this.onDestroy$.next();
		this.onDestroy$.complete();
	}

	public openModal() {
			this.modalDisplay = 'block';
	}

	public closeModal() {
		this.modalDisplay = 'none';
	}

	public toggleModal() {
		if (this.modalDisplay == 'none') {
			this.openModal();
		} else {
			this.closeModal();
		}
	}

	public downloadFile(downloadRequest: DownloadRequest) {

		if (downloadRequest.fileType === PDF) {
			let win = window.open('/loading', '_blank');
			win.location.href = downloadRequest.url;
		} else {
			let win = window.open('/downloaded', '_blank');
			win.location.href = downloadRequest.url;
		}

		this.downloadService.downloadFile(downloadRequest);
	}

	public resetDownloadList() {
		this.downloadService.resetDownloadList();
	}

	public removeDownloadedAndFailedDownloads() {
		this.downloadService.removeDownloadedAndFailedDownloads();
	}

	public isModalEmpty(): boolean {
			return this.downloadService.isModalEmpty();
	}

	public hasFailedDownloads() {
			return this.downloadService.failedDownloadsCount > 0;
	}
}