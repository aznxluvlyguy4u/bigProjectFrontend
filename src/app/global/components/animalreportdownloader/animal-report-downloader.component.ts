import { Component, OnDestroy, OnInit } from '@angular/core';
import { Animal } from '../livestock/livestock.model';
import { TranslatePipe } from 'ng2-translate';
import { DownloadService } from '../../services/download/download.service';
import { CSV, PDF } from '../../variables/file-type.enum';
import { FileTypeSelectorComponent } from '../filetypeselector/file-type-selector.component';
import { AnimalReportDownloaderService } from '../../services/download/animal-report-downloader.service';
import { Subscription } from 'rxjs/Subscription';
import { BooleanSwitchComponent } from '../booleanswitch/boolean-switch.component';

@Component({
	selector: 'app-animal-report-downloader',
	directives: [FileTypeSelectorComponent, BooleanSwitchComponent],
	template: require('./animal-report-downloader.component.html'),
	pipes: [TranslatePipe]
})
export class AnimalReportDownloaderComponent implements OnInit, OnDestroy {

	title = 'ANIMAL REPORTS';
	modalDisplay: string = 'none';

	pedigreeCertificateFileType: string = 'PDF';
	concatBreedValueAndAccuracyColumns: boolean = true;

	private isModalActiveSubscription: Subscription;

	constructor(private downloadService: DownloadService,
							private animalReportDownloaderService: AnimalReportDownloaderService
	) {}

	ngOnInit() {

		this.isModalActiveSubscription = this.animalReportDownloaderService.isModalActive.subscribe(
			(notifyUser: boolean) => {
				if (notifyUser) {
					this.openModal();
				} else {
					this.closeModal();
				}
			}
		);

	}

	ngOnDestroy() {
		this.isModalActiveSubscription.unsubscribe();
	}

	areAnimalsSelected(): boolean {
		return this.getAnimals().length > 0;
	}

	getAnimals(): Animal[] {
		return this.animalReportDownloaderService.animals;
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

	public pedigreeCertificateFileTypes(): string[] {
		return [ CSV, PDF ];
	}

	downloadPedigreeCertificatesOfFilteredAnimals() {
		if (this.areAnimalsSelected()) {
			this.downloadService.doLineageProofPostRequest(this.getAnimals(), this.pedigreeCertificateFileType)
		}
		this.closeModal();
	}

	downloadOffspringReportOfFilteredAnimals() {
		if (this.areAnimalsSelected()) {
			this.downloadService.doOffspringRequest(this.getAnimals(), this.concatBreedValueAndAccuracyColumns)
		}
		this.closeModal();
	}
}