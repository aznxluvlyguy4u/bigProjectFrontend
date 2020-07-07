import {Injectable, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import { NSFOService } from '../nsfo/nsfo.service';

import * as _ from 'lodash';
import {ReportRequest} from './report-request.model';
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class ReportService implements OnInit {

  isModalActive = new Subject<boolean>();
  toggleIsModalActive = new Subject<boolean>();
  reportsShownInModelChanged = new Subject<ReportRequest[]>();
  failedReportsCount: number;
  private reportRequestShownInModal: ReportRequest[];

  private isFirstFetch = true;

  private requestSub: Subscription;

  constructor(private nsfo: NSFOService) {
      this.resetReportList();
      this.fetchReports();
  }

  ngOnInit() {
  }

    ngOnDestroy() {
        this.requestSub.unsubscribe();
    }

  fetchReports() {
    this.requestSub = this.nsfo.doGetRequest(this.nsfo.API_URI_GET_REPORTS).subscribe((res) => {
        this.resetReportList();
        const reportRequest: ReportRequest[] = res.result;
        reportRequest.forEach((report) => {
            this.reportRequestShownInModal.push(report);
        });
        this.reportsShownInModelChanged.next(this.reportRequestShownInModal.slice());

        const hasUnfinished = _.filter(this.reportRequestShownInModal, function (download: ReportRequest) {
            return (!download.finished_at);
        });
        if (hasUnfinished.length > 0) {
            setTimeout(() => {
                this.fetchReports();
            }, 2000);
        } else {
            if (this.reportRequestShownInModal.length > 0 && !this.isFirstFetch) {
                this.updateModalNotificationStatus(true);
            }
        }
        this.isFirstFetch = false;
    });
  }

  resetReportList() {
    this.reportRequestShownInModal = [];
    this.failedReportsCount = 0;
  }

  getReportRequestsShownInModal(): ReportRequest[] {
    return this.reportRequestShownInModal;
  }

  getReportsInModalCount(): number {
    return this.reportRequestShownInModal.length;
  }

  isModalEmpty(): boolean {
    return this.getReportsInModalCount() === 0;
  }

  public openReportModal() {
    this.updateModalNotificationStatus(true);
  }

  public closeReportModal() {
    this.updateModalNotificationStatus(false);
  }

  public toggleReportModal() {
    this.toggleIsModalActive.next(true);
  }

  private updateModalNotificationStatus(openModal: boolean) {
    this.isModalActive.next(openModal);
  }
}
