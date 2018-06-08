import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DownloadRequest } from './download-request.model';

import _ = require("lodash");
import {
	QUERY_PARAM_CONCAT_VALUE_AND_ACCURACY, QUERY_PARAM_FILE_TYPE, REFERENCE_DATE,
	YEAR
} from '../../variables/query-param.constant';
import { QueryParamsService } from '../utils/query-params.service';
import { Ewe } from '../../models/ewe.model';
import { Ram } from '../../models/ram.model';
import { UtilsService } from '../utils/utils.service';
import { Animal } from '../../components/livestock/livestock.model';
import { NSFOService } from '../nsfo/nsfo.service';
import {
	ALL_ANIMALS_OVERVIEW_REPORT, ANNUAL_ACTIVE_LIVESTOCK_RAM_MATES_REPORT, ANNUAL_ACTIVE_LIVESTOCK_REPORT,
	TE100_ANNUAL_PRODUCTION
} from '../../constants/report-type.constant';
import {CSV, PDF} from '../../variables/file-type.enum';
import {Invoice} from "../../../main/invoice/invoice.model";

export const INBREEDING_COEFFICIENT_REPORT = 'INBREEDING_COEFFICIENT_REPORT';
export const INVOICE_PDF = "INVOICE_PDF";
export const LINEAGE_PROOF_REPORT = 'LINEAGE_PROOF_REPORT';
export const LIVESTOCK_REPORT = 'LIVESTOCK_REPORT';
export const OFFSPRING_REPORT = 'OFFSPRING_REPORT';

@Injectable()
export class DownloadService {

		isModalActive = new Subject<boolean>();
		toggleIsModalActive = new Subject<boolean>();
		downloadsChanged = new Subject<DownloadRequest[]>();
		downloadsShownInModalChanged = new Subject<DownloadRequest[]>();

		private downloadRequests: DownloadRequest[];
		private downloadRequestShownInModal: DownloadRequest[];
		private lastId: number;

		failedDownloadsCount: number;

		constructor(private nsfo: NSFOService) {
				this.resetDownloadList();
		}

		resetDownloadList() {
				this.downloadRequests = [];
				this.lastId = 0;
				this.notifyDownloadListsChanged();
				this.failedDownloadsCount = 0;
		}

		removeDownloadedAndFailedDownloads() {
				this.downloadRequests = _.filter(this.downloadRequests, function(download: DownloadRequest) {
						return download.isDownloaded || !download.isFailed;
				});
				this.notifyDownloadListsChanged();
		}

		getNewDownloadRequest(downloadType: string, fileType: string, reportCount: number|string = 0, jsonBody: any, queryParam: string): DownloadRequest {
				const hash = DownloadService.generateHash(downloadType, fileType, reportCount, jsonBody, queryParam);

				if (this.isDuplicateDownloadRequest(hash)) {
						return null;
				}

				let download = new DownloadRequest();
				download.id = this.getNextId();
				download.isCompleted = false;
				download.isFailed = false;
				download.downloadType = downloadType;
				download.fileType = fileType;
				download.isDownloaded = false;
				download.logDate = new Date();
				download.reportCount = reportCount;
				download.hash = hash;
				return download;
		}

		private getNextId(): number {
				this.lastId++;
				return this.lastId;
		}

		getDownloadRequests(): DownloadRequest[] {
				return this.downloadRequests;
		}

		getDownloadRequestsShownInModal(): DownloadRequest[] {
				return this.downloadRequestShownInModal;
		}

		getDownloadsInModalCount(): number {
				return this.downloadRequestShownInModal.length;
		}

		getFailedDownloadCount(): number {
				return this.failedDownloadsCount;
		}

		isModalEmpty(): boolean {
				return this.getDownloadsInModalCount() === 0;
		}

		addDownload(download: DownloadRequest) {
				this.downloadRequests.push(download);
				this.notifyDownloadListsChanged();
		}

		failDownload(download: DownloadRequest, error: any = null) {
				download.isFailed = true;
				if (error != null) {
					download.errorMessage = this.nsfo.getErrorMessage(error);
				}
				this.updateDownload(download);
				this.openDownloadModal();
		}

		completeDownloadPreparation(download: DownloadRequest) {
				download.isCompleted = true;
				this.updateDownload(download);
				this.openDownloadModal();
		}

		downloadFile(download: DownloadRequest): DownloadRequest {
				download.isDownloaded = true;
				this.updateDownload(download);
				return download;
		}

		private updateDownload(download: DownloadRequest) {
				const index = _.findIndex(this.downloadRequests, {id: download.id});
				this.downloadRequests[index] = download;
				this.notifyDownloadListsChanged();
		}

		private isDuplicateDownloadRequest(hash: string): boolean {
				return _.findIndex(this.downloadRequests,
					{hash: hash, isCompleted: false, isFailed: false}
					) !== -1;
		}

		public openDownloadModal() {
				this.updateModalNotificationStatus(true);
		}

		public closeDownloadModal() {
				this.updateModalNotificationStatus(false);
		}

		public toggleDownloadModal() {
				this.toggleIsModalActive.next(true);
		}

		private updateModalNotificationStatus(openModal: boolean) {
				this.isModalActive.next(openModal);
		}

		private notifyDownloadListsChanged() {
				this.downloadsChanged.next(this.downloadRequests.slice());
				this.updateDownloadRequestsShownForModal();
				this.updateFailedDownloadCount();
				this.downloadsShownInModalChanged.next(this.downloadRequestShownInModal.slice());
		}

		updateDownloadRequestsShownForModal() {
				this.downloadRequestShownInModal = _.filter(this.downloadRequests, function(download: DownloadRequest) {
						return (!download.isDownloaded) || download.isFailed;
				});
		}

		updateFailedDownloadCount() {
				this.failedDownloadsCount = _.filter(this.downloadRequests, {isFailed: true}).length;
		}

		private doDownloadPostRequest(uri: string, request: any, download: DownloadRequest) {

			if (download == null) {
				return;
			}

			this.addDownload(download);

			this.nsfo.doPostRequest(uri, request)
				.subscribe(
					res => {
						download.url = res.result;
						this.completeDownloadPreparation(download);
					},
					error => {
						this.failDownload(download, error);
					}
				);
		}

	private doDownloadGetRequest(uri: string, download: DownloadRequest) {

		if (download == null) {
			return;
		}

		this.addDownload(download);

		this.nsfo.doGetRequest(uri)
			.subscribe(
				res => {
					download.url = res.result;
					this.completeDownloadPreparation(download);
				},
				error => {
					this.failDownload(download, error);
				}
			);
	}

		doLineageProofPostRequest(animals: Animal[], fileType: string = 'PDF') {

				const request = {
						animals: NSFOService.cleanAnimalsInput(animals)
					};

				const queryParam = typeof fileType === "string" ? '?' + QUERY_PARAM_FILE_TYPE + '=' + fileType.toLowerCase() : '';
				let download = this.getNewDownloadRequest(LINEAGE_PROOF_REPORT, fileType, animals.length, request, queryParam);

				this.doDownloadPostRequest(this.nsfo.URI_GET_LINEAGE_PROOF + queryParam, request, download);
		}

		doOffspringRequest(animals: Animal[], concatBreedValueAndAccuracyColumns: boolean) {

			const request = {
				parents: NSFOService.cleanAnimalsInput(animals)
			};

			const concatBooleanString = UtilsService.getBoolValAsString(concatBreedValueAndAccuracyColumns);
			let queryParam = '?' + QUERY_PARAM_CONCAT_VALUE_AND_ACCURACY + '=' + concatBooleanString;

			const download = this.getNewDownloadRequest(OFFSPRING_REPORT, CSV, animals.length, request, queryParam);

			this.doDownloadPostRequest(this.nsfo.URI_GET_OFFSPRING + queryParam, request, download);
		}

	doLivestockReportPostRequest(animals: Animal[], fileType: string, concatBreedValueAndAccuracyColumns: boolean) {

				let data = {};
				let dataCount = 0;
				if (animals !== null) {
						data = this.parseFilteredLivestockReportPostBody(animals);
						dataCount = animals.length;
				}

				const concatBooleanString = UtilsService.getBoolValAsString(concatBreedValueAndAccuracyColumns);
				let queryParam = '?' + QUERY_PARAM_CONCAT_VALUE_AND_ACCURACY + '=' + concatBooleanString;
				queryParam += typeof fileType === "string" ? '&' + QUERY_PARAM_FILE_TYPE + '=' + fileType.toLowerCase() : '';

				const download = this.getNewDownloadRequest(LIVESTOCK_REPORT, fileType, dataCount, data, queryParam);

				this.doDownloadPostRequest(this.nsfo.URI_GET_LIVESTOCK_DOCUMENT + queryParam, data, download);
		}


		doAnimalsOverviewReportGetRequest(referenceDateString: string, concatBreedValueAndAccuracyColumns: boolean = true) {

			const concatBooleanString = UtilsService.getBoolValAsString(concatBreedValueAndAccuracyColumns);
			let queryParam = '?' + REFERENCE_DATE + '=' + referenceDateString + '&' + QUERY_PARAM_CONCAT_VALUE_AND_ACCURACY + '=' + concatBooleanString;
			let download = this.getNewDownloadRequest(ALL_ANIMALS_OVERVIEW_REPORT, CSV, referenceDateString, null, queryParam);

			this.doDownloadGetRequest(this.nsfo.URI_GET_ANIMALS_OVERVIEW_REPORT + queryParam, download);
		}


		doAnnualTe100UbnProductionReportGetRequest(year: number) {

			let queryParam = '?' + YEAR + '=' + year;
			let download = this.getNewDownloadRequest(TE100_ANNUAL_PRODUCTION, CSV, year, null, queryParam);

			this.doDownloadGetRequest(this.nsfo.URI_GET_ANNUAL_TE100_UBN_PRODUCTION_REPORT + queryParam, download);
		}


		doAnnualActiveLivestockReportGetRequest(year: number) {

			let queryParam = '?' + YEAR + '=' + year;
			let download = this.getNewDownloadRequest(ANNUAL_ACTIVE_LIVESTOCK_REPORT, CSV, year, null, queryParam);

			this.doDownloadGetRequest(this.nsfo.URI_GET_ANNUAL_ACTIVE_LIVESTOCK_REPORT + queryParam, download);
		}


		doAnnualActiveLivestockRamMatesReportGetRequest(year: number) {

			let queryParam = '?' + YEAR + '=' + year;
			let download = this.getNewDownloadRequest(ANNUAL_ACTIVE_LIVESTOCK_RAM_MATES_REPORT, CSV, year, null, queryParam);

			this.doDownloadGetRequest(this.nsfo.URI_GET_ANNUAL_ACTIVE_LIVESTOCK_RAM_MATES_REPORT + queryParam, download);
		}


		private parseFilteredLivestockReportPostBody(animals: Animal[]) {
				const content: any[] = [];
				for (const animal of animals) {
				content.push({
						uln_country_code: animal.uln_country_code,
						uln_number: animal.uln_number,
				});
			}
			return {animals: content};
		}


		doInbreedingCoefficientReportPostRequest(ram: Ram, ewes: Ewe[], fileType: string) {

				let request = {
						"ram": {
								"uln_country_code": ram.uln_country_code,
								"uln_number": ram.uln_number
						},
						"ewes": ewes
				};

			let download = this.getNewDownloadRequest(INBREEDING_COEFFICIENT_REPORT, fileType, ewes.length, request, null);

			this.doDownloadPostRequest(this.nsfo.URI_GET_INBREEDING_COEFFICIENT + QueryParamsService.getFileTypeQueryParam(fileType), request, download);
		}

		static generateHash(downloadType: string, fileType: string, reportCount: number|string = 0, jsonBody: any, queryParam: string): string {
				return btoa(downloadType + fileType + reportCount + queryParam + JSON.stringify(jsonBody));
		}

		doInvoicePdfGetRequest(invoice: Invoice) {
			let download = this.getNewDownloadRequest(INVOICE_PDF,PDF, 0, null, null);
			let uri = this.nsfo.URI_INVOICE + "/" + invoice.id + "/pdf";
			this.doDownloadGetRequest(uri, download);
		}
}