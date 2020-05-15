import {Component, OnDestroy, OnInit} from '@angular/core';

import {PDF} from '../../variables/file-type.enum';
import { Subscription } from 'rxjs/Subscription';
import {ReportRequest, ReportType} from '../../services/report/report-request.model';
import {ReportService} from '../../services/report/report.service';
import {TranslatePipe, TranslateService} from "ng2-translate";
import {PaginatePipe, PaginationService} from "ng2-pagination";
import {PaginationComponent} from "../pagination/pagination.component";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-report-modal',
    template: require('./report-modal.component.html'),
    directives: [PaginationComponent],
    providers: [PaginationService],
    pipes: [PaginatePipe, TranslatePipe]
})
export class ReportModalComponent implements OnInit, OnDestroy {
    public reportRequestsShownInModal: ReportRequest[];
    private modalDisplay = 'none';

    private onDestroy$: Subject<void> = new Subject<void>();

    public filterAmount: number = 5;
    public page: number =1;
	public title = 'REPORT OVERVIEW';

  constructor(
      private translate: TranslateService,
      private reportService: ReportService) {
  }


  ngOnInit() {

    this.reportService.reportsShownInModelChanged
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(
      (downloadRequests: ReportRequest[]) => {
        this.reportRequestsShownInModal = downloadRequests;
        this.closeIfEmpty();
      }
    );
    this.reportRequestsShownInModal = this.reportService.getReportRequestsShownInModal();

    this.reportService.isModalActive
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


   this.reportService.toggleIsModalActive
       .pipe(takeUntil(this.onDestroy$))
       .subscribe(
      (toggleModal: boolean) => {
        if (toggleModal) {
          this.toggleModal();
        }
      }
    );
  }

  public getReportTypeString(reportType: ReportType) {
    switch (reportType) {
        case ReportType.LIVE_STOCK:
          return this.translate.instant('REPORT_LIVE_STOCK');
        case ReportType.ANNUAL_ACTIVE_LIVE_STOCK:
          return this.translate.instant('REPORT_ANNUAL_ACTIVE_LIVE_STOCK');
        case ReportType.ANNUAL_TE_100:
          return this.translate.instant('REPORT_ANNUAL_TE_100');
        case ReportType.ANIMAL_TREATMENTS_PER_YEAR_REPORT:
            return this.translate.instant('ANIMAL TREATMENTS PER YEAR REPORT');
        case ReportType.FERTILIZER_ACCOUNTING:
          return this.translate.instant('REPORT_FERTILIZER_ACCOUNTING');
        case ReportType.INBREEDING_COEFFICIENT:
          return this.translate.instant('REPORT_INBREEDING_COEFFICIENT');
        case ReportType.PEDIGREE_CERTIFICATE:
          return this.translate.instant('REPORT_PEDIGREE_CERTIFICATE');
        case ReportType.ANIMALS_OVERVIEW:
          return this.translate.instant('REPORT_ANIMALS_OVERVIEW');
        case ReportType.ANNUAL_ACTIVE_LIVE_STOCK_RAM_MATES:
          return this.translate.instant('REPORT_ANNUAL_ACTIVE_LIVE_STOCK_RAM_MATES');
        case ReportType.OFF_SPRING:
          return this.translate.instant('REPORT_OFF_SPRING');
        case ReportType.PEDIGREE_REGISTER_OVERVIEW:
          return this.translate.instant('REPORT_PEDIGREE_REGISTER_OVERVIEW');
        case ReportType.BIRTH_LIST:
            return this.translate.instant('REPORT_BIRTH_LIST');
        case ReportType.MEMBERS_AND_USERS_OVERVIEW:
            return this.translate.instant('REPORT_MEMBERS_AND_USERS_OVERVIEW');
        case ReportType.ANIMAL_HEALTH_STATUS_REPORT:
            return this.translate.instant('REPORT_ANIMAL_HEALTH_STATUS');
        case ReportType.CLIENT_NOTES_OVERVIEW:
            return this.translate.instant('REPORT_CLIENT_NOTES_OVERVIEW');
        case ReportType.WEIGHTS_PER_YEAR_OF_BIRTH_REPORT:
            return this.translate.instant('WEIGHTS PER YEAR OF BIRTH REPORT');
        case ReportType.ANIMAL_FEATURES_PER_YEAR_OF_BIRTH_REPORT:
            return this.translate.instant('ANIMAL FEATURES PER YEAR OF BIRTH REPORT');
        case ReportType.POPREP_INPUT_FILE:
            return this.translate.instant('POPREP INPUT FILE');
        default:
          return this.translate.instant('REPORT_UNKNOWN');
    }
  }

  closeIfEmpty() {
    if (this.reportRequestsShownInModal.length === 0) {
      this.closeModal();
    }
  }

    ngOnDestroy() {
        this.onDestroy$.next();
    }

  public openModal() {
    this.modalDisplay = 'block';
  }

  public closeModal() {
    this.modalDisplay = 'none';
  }

  public toggleModal() {
    if (this.modalDisplay === 'none') {
      this.openModal();
    } else {
      this.closeModal();
    }
  }


  public downloadFile(downloadRequest: ReportRequest) {

    if (downloadRequest.file_type === PDF) {
      const win = window.open('/loading', '_blank');
      win.location.href = downloadRequest.download_url;
    } else {
      const win = window.open('/downloaded', '_blank');
      win.location.href = downloadRequest.download_url;
    }
  }

  public resetDownloadList() {
    this.reportService.resetReportList();
  }

  public isModalEmpty(): boolean {
    return this.reportService.isModalEmpty();
  }

  public hasFailedDownloads() {
    return this.reportService.failedReportsCount > 0;
  }
}
