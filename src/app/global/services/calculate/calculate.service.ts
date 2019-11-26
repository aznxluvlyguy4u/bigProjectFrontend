import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

import {NSFOService} from '../nsfo/nsfo.service';
import {ReportService} from "../report/report.service";
import {DownloadRequest} from "../download/download-request.model";

export const INBREEDING_COEFFICIENT_REPORT = 'INBREEDING_COEFFICIENT_REPORT';
export const INVOICE_PDF = "INVOICE_PDF";
export const LINEAGE_PROOF_REPORT = 'LINEAGE_PROOF_REPORT';
export const LIVESTOCK_REPORT = 'LIVESTOCK_REPORT';
export const OFFSPRING_REPORT = 'OFFSPRING_REPORT';

@Injectable()
export class CalculateService {

    isModalActive = new Subject<boolean>();
    toggleIsModalActive = new Subject<boolean>();
    downloadsChanged = new Subject<DownloadRequest[]>();
    downloadsShownInModalChanged = new Subject<DownloadRequest[]>();

    private downloadRequests: DownloadRequest[];
    private downloadRequestShownInModal: DownloadRequest[];
    private lastId: number;

    failedDownloadsCount: number;

    constructor(
        private nsfo: NSFOService,
        private reportService: ReportService,
    ) {
        // this.resetTaskList();
    }
    //
    // resetTaskList() {
    //     this.downloadRequests = [];
    //     this.lastId = 0;
    //     this.notifyDownloadListsChanged();
    //     this.failedDownloadsCount = 0;
    // }
    //
    // removeDownloadedAndFailedDownloads() {
    //     this.downloadRequests = _.filter(this.downloadRequests, function (download: DownloadRequest) {
    //         return download.isDownloaded || !download.isFailed;
    //     });
    //     this.notifyDownloadListsChanged();
    // }
    //
    // getNewDownloadRequest(downloadType: string, fileType: string, reportCount: number | string = 0, jsonBody: any, queryParam: string): DownloadRequest {
    //     const hash = CalculateService.generateHash(downloadType, fileType, reportCount, jsonBody, queryParam);
    //
    //     if (this.isDuplicateDownloadRequest(hash)) {
    //         return null;
    //     }
    //
    //     let download = new DownloadRequest();
    //     download.id = this.getNextId();
    //     download.isCompleted = false;
    //     download.isFailed = false;
    //     download.downloadType = downloadType;
    //     download.fileType = fileType;
    //     download.isDownloaded = false;
    //     download.logDate = new Date();
    //     download.reportCount = reportCount;
    //     download.hash = hash;
    //     return download;
    // }
    //
    // static generateHash(downloadType: string, fileType: string, reportCount: number | string = 0, jsonBody: any, queryParam: string): string {
    //     return btoa(downloadType + fileType + reportCount + queryParam + JSON.stringify(jsonBody));
    // }
    //
    // private getNextId(): number {
    //     this.lastId++;
    //     return this.lastId;
    // }
    //
    // getDownloadRequests(): DownloadRequest[] {
    //     return this.downloadRequests;
    // }
    //
    // getDownloadRequestsShownInModal(): DownloadRequest[] {
    //     return this.downloadRequestShownInModal;
    // }
    //
    // getDownloadsInModalCount(): number {
    //     return this.downloadRequestShownInModal.length;
    // }
    //
    // getFailedDownloadCount(): number {
    //     return this.failedDownloadsCount;
    // }
    //
    // isModalEmpty(): boolean {
    //     return this.getDownloadsInModalCount() === 0;
    // }
    //
    // addDownload(download: DownloadRequest) {
    //     this.downloadRequests.push(download);
    //     this.notifyDownloadListsChanged();
    // }
    //
    // failDownload(download: DownloadRequest, error: any = null) {
    //     download.isFailed = true;
    //     if (error != null) {
    //         download.errorMessage = this.nsfo.getErrorMessage(error);
    //     }
    //     this.updateDownload(download);
    //     this.openDownloadModal();
    // }
    //
    // completeDownloadPreparation(download: DownloadRequest) {
    //     download.isCompleted = true;
    //     this.updateDownload(download);
    //     this.openDownloadModal();
    // }
    //
    // downloadFile(download: DownloadRequest): DownloadRequest {
    //     download.isDownloaded = true;
    //     this.updateDownload(download);
    //     return download;
    // }
    //
    // private updateDownload(download: DownloadRequest) {
    //     const index = _.findIndex(this.downloadRequests, {id: download.id});
    //     this.downloadRequests[index] = download;
    //     this.notifyDownloadListsChanged();
    // }
    //
    // private isDuplicateDownloadRequest(hash: string): boolean {
    //     return _.findIndex(this.downloadRequests,
    //         {hash: hash, isCompleted: false, isFailed: false}
    //     ) !== -1;
    // }
    //
    // public openDownloadModal() {
    //     this.updateModalNotificationStatus(true);
    // }
    //
    // public closeDownloadModal() {
    //     this.updateModalNotificationStatus(false);
    // }
    //
    // public toggleDownloadModal() {
    //     this.toggleIsModalActive.next(true);
    // }
    //
    // private updateModalNotificationStatus(openModal: boolean) {
    //     this.isModalActive.next(openModal);
    // }
    //
    // private notifyDownloadListsChanged() {
    //     this.downloadsChanged.next(this.downloadRequests.slice());
    //     this.updateDownloadRequestsShownForModal();
    //     this.updateFailedDownloadCount();
    //     this.downloadsShownInModalChanged.next(this.downloadRequestShownInModal.slice());
    // }
    //
    // updateDownloadRequestsShownForModal() {
    //     this.downloadRequestShownInModal = _.filter(this.downloadRequests, function (download: DownloadRequest) {
    //         return (!download.isDownloaded) || download.isFailed;
    //     });
    // }
    //
    // updateFailedDownloadCount() {
    //     this.failedDownloadsCount = _.filter(this.downloadRequests, {isFailed: true}).length;
    // }

    // private doDownloadPostRequestAndStoreInModal(uri: string, request: any, download: DownloadRequest) {
    //
    //     if (download == null) {
    //         return;
    //     }
    //
    //     this.addDownload(download);
    //
    //     this.nsfo.doPostRequest(uri, request)
    //         .subscribe(
    //         res => {
	// 						download.url = res.result;
    //           this.completeDownloadPreparation(download);
    //         },
    //         error => {
    //             this.failDownload(download, error);
    //         }
    //       );
    // }
    //
    // private doDownloadGetRequestAndStoreInModal(uri: string, download: DownloadRequest) {
    //
    //     if (download == null) {
    //         return;
    //     }
    //
    //     this.addDownload(download);
    //
    //     this.nsfo.doGetRequest(uri)
    //         .subscribe(
    //             res => {
    //             download.url = res.result;
    //             this.completeDownloadPreparation(download);
    //         },
    //             error => {
	// 								this.failDownload(download, error);
    //             }
    //         );
    // }

    // private doDownloadPostRequestByReportWorker(uri: string, request: any) {
	//
    //     this.nsfo.doPostRequest(uri, request)
    //         .subscribe(
    //             res => {
    //                 this.reportService.fetchReports();
    //             },
    //             error => {
	// 								alert(this.nsfo.getErrorMessage(error));
    //             }
    //         );
    // }
	//
	// /**
	//  * @param {string} uri
	//  * @param {boolean} openInNewTab use true for for example PDFs
	//  */
	// private doDownloadGetWithImmediateDownload(uri: string, openInNewTab: boolean) {
	// 	const newTabUrl = openInNewTab ? '/loading' : '/downloaded';
	// 	const win = window.open(newTabUrl, '_blank');
	//
	// 	this.nsfo.doGetRequest(uri)
	// 		.subscribe(
	// 			res => {
	// 			    const downloadUrl = res.result;
	// 				  win.location.href = downloadUrl;
	// 			},
	// 			error => {
	// 				alert(this.nsfo.getErrorMessage(error));
	// 			}
	// 		);
    // }
	//
	//
	// /**
	//  * @param {string} uri
	//  * @param request
	//  * @param {boolean} openInNewTab use true for for example PDFs
	//  */
	// private doDownloadPostWithImmediateDownload(uri: string, request: any, openInNewTab: boolean) {
	// 	const newTabUrl = openInNewTab ? '/loading' : '/downloaded';
	// 	const win = window.open(newTabUrl, '_blank');
	//
	// 	this.nsfo.doPostRequest(uri, request)
	// 		.subscribe(
	// 			res => {
	// 				const downloadUrl = res.result;
	// 				win.location.href = downloadUrl;
	// 			},
	// 			error => {
	// 				alert(this.nsfo.getErrorMessage(error));
	// 			}
	// 		);
	// }
	//
    private doDownloadGetRequestByReportWorker(uri: string) {
        this.nsfo.doGetRequest(uri)
            .subscribe(
                res => {
                    this.reportService.fetchReports();
                },
                error => {
									alert(this.nsfo.getErrorMessage(error));
                }
            );
    }

    doAnimalHealthStatusReportGetRequest() {
        this.doDownloadGetRequestByReportWorker(this.nsfo.URI_GET_ANIMAL_HEALTH_STATUS_REPORT);
    }
}
