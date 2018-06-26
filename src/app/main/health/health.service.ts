import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { NSFOService } from '../../global/services/nsfo/nsfo.service';
import { AnnouncementLocationOutput, LocationHealthInspection } from './health.model';
import { _CAE, _CL, _MAEDI_VISNA, _ROT, _SCRAPIE } from '../../global/constants/illness-type.constant';
import { CAE, CL, MAEDI_VISNA, ROT, SCRAPIE } from '../../global/constants/illness-type-query-param-value.constant';

@Injectable()
export class HealthService {

    private toAnnounce = new Subject<any>();
    private announced = new Subject<any>();
    private toReceiveLabResults = new Subject<any>();
    private ongoing = new Subject<any>();
    private toAuthorize = new Subject<any>();
    private finished = new Subject<any>();
    private expired = new Subject<any>();
    private loadingState = new Subject<any>();

    // private toAnnounceCount = new Subject<any>();
    // private announcedCount = new Subject<any>();
    // private ongoingCount = new Subject<any>();
    // private toAuthorizeCount = new Subject<any>();
    // private finishedCount = new Subject<any>();
    // private expiredCount = new Subject<any>();

    private toAnnounceIsLoading = new Subject<boolean>();
    private announcedIsLoading = new Subject<boolean>();
    private toReceiveLabResultsIsLoading = new Subject<boolean>();
    private toAuthorizeIsLoading = new Subject<boolean>();
    private finishedIsLoading = new Subject<boolean>();
    private expiredIsLoading = new Subject<boolean>();

    public toAnnounceIsLoading$ = this.toAnnounceIsLoading.asObservable();
    public announcedIsLoading$ = this.announcedIsLoading.asObservable();
    public toReceiveLabResultsIsLoading$ = this.toReceiveLabResultsIsLoading.asObservable();
    public toAuthorizeIsLoading$ = this.toAuthorizeIsLoading.asObservable();
    public finishedIsLoading$ = this.finishedIsLoading.asObservable();
    public expiredIsLoading$ = this.expiredIsLoading.asObservable();

    public toAnnounce$ = this.toAnnounce.asObservable();
    public announced$ = this.announced.asObservable();
    public toReceiveLabResults$ = this.toReceiveLabResults.asObservable();
    public toAuthorize$ = this.toAuthorize.asObservable();
    public ongoing$ = this.ongoing.asObservable();
    public finished$ = this.finished.asObservable();
    public expired$ = this.expired.asObservable();
    public loadingState$ = this.loadingState.asObservable();

    orderNumber: string;

    selectedIllness: string;

    private _dataStore: {
        toAnnounce:Array<AnnouncementLocationOutput>,
        announced:Array<LocationHealthInspection>,
        toReceiveLabResults:Array<LocationHealthInspection>,
        ongoing:Array<LocationHealthInspection>,
        toAuthorize:Array<LocationHealthInspection>,
        finished:Array<LocationHealthInspection>,
        expired:Array<LocationHealthInspection>,
        loadingState:boolean,
        isLoading:boolean,

        toAnnounceIsLoading: boolean,
        announcedIsLoading: boolean,
        toReceiveLabResultsIsLoading: boolean,
        toAuthorizeIsLoading: boolean,
        finishedIsLoading: boolean,
        expiredIsLoading: boolean
    }

    constructor( private nsfoService:NSFOService ) {
        this._dataStore = {
            toAnnounce:[],
            announced:[],
            toReceiveLabResults:[],
            ongoing:[],
            toAuthorize:[],
            finished:[],
            expired:[],
            loadingState:false,
            isLoading:false,
            toAnnounceIsLoading: false,
            announcedIsLoading: false,
            toReceiveLabResultsIsLoading: false,
            toAuthorizeIsLoading: false,
            finishedIsLoading: false,
            expiredIsLoading: false
        };
    }

    /** Load Locations that need to be inspected soon and need to be Announced. and pass the latest result set in to the observable stream */
    public loadToAnnounce(){
        this.toAnnounceIsLoading.next(true);
        this.nsfoService.doGetRequest(this.nsfoService.URI_LOCATIONS_TO_ANNOUNCE + '&illness_type=' + this.getIllnessTypeQueryParam())
            .subscribe(res => {
                this._dataStore.toAnnounce = res.result;
                this.toAnnounce.next(this._dataStore.toAnnounce);
                this.toAnnounceIsLoading.next(false);
            });
    }

    public fetchToAnnounce(){
        this.toAnnounce.next(this._dataStore.toAnnounce);
    }

    public loadAnnounced(){
        this.announcedIsLoading.next(true);
        this.nsfoService.doGetRequest(this.nsfoService.URI_LOCATIONS_ANNOUNCED + '&illness_type=' + this.getIllnessTypeQueryParam())
            .subscribe(res => {
                this._dataStore.announced = res.result;
                this.announced.next(this._dataStore.announced);
                this.announcedIsLoading.next(false);
            });
    }

    public fetchAnnounced(){
        this.announced.next(this._dataStore.announced);
    }

    /** Load inspections waiting for the labresults coming in. and pass the latest result set in to the observable stream */
    public loadToReceiveLabResults(){
        this.toReceiveLabResultsIsLoading.next(true);
        this.nsfoService.doGetRequest(this.nsfoService.URI_INSPECTIONS_TO_RECEIVE_LAB_RESULTS + '&illness_type=' + this.getIllnessTypeQueryParam())
            .subscribe(res => {
                this._dataStore.toReceiveLabResults = res.result;
                this.toReceiveLabResults.next(this._dataStore.toReceiveLabResults);
                this.toReceiveLabResultsIsLoading.next(false);
            });
    }

    public fetchToReceiveLabResults(){
        this.toReceiveLabResults.next(this._dataStore.toReceiveLabResults);
    }

    /** Load Inspectiones in need of Authorization and pass the latest result set in to the observable stream */
    public loadToAuthorize(){
        this.nsfoService.doGetRequest(this.nsfoService.URI_INSPECTIONS_TO_AUTHORIZE + '&illness_type=' + this.getIllnessTypeQueryParam())
            .subscribe(res => {
                this._dataStore.toAuthorize = res.result;
                this.toAuthorize.next(this._dataStore.toAuthorize);
            });
    }

    public fetchToAuthorize(){
        this.toAuthorize.next(this._dataStore.toAuthorize);
    }

    /** Load Finished inspections and pass the latest result set in to the observable stream */
    public loadFinished(){
        this.nsfoService.doGetRequest(this.nsfoService.URI_INSPECTIONS_FINISHED + '&illness_type=' + this.getIllnessTypeQueryParam())
            .subscribe(res => {
                this._dataStore.finished = res.result;
                this.finished.next(this._dataStore.finished);
            });
    }

    /** Load Expired inspections and pass the latest result set in to the observable stream */
    public loadExpired(){
        this.nsfoService.doGetRequest(this.nsfoService.URI_INSPECTIONS_EXPIRED + '&illness_type=' + this.getIllnessTypeQueryParam())
            .subscribe(res => {
                this._dataStore.expired = res.result;
                this.expired.next(this._dataStore.expired);
            });
    }

    public fetchExpired(){
        this.expired.next(this._dataStore.expired);
    }

    /** Create a single LocationHealthInspection */
    public createInspection(announcement){

      const illness = this.selectedIllness;

      let inspection = {
          ubn: announcement.location.ubn,
          inspection_subject: illness,
          announcement_id: announcement.id,
          animal_count: announcement.location.livestock_count
      };

      this.nsfoService.doPostRequest(this.nsfoService.URI_INSPECTIONS, inspection)
        .subscribe(
            res => {
                let result = res.result;
                let body = {
                    ubn: announcement.location.ubn,
                    order_number: announcement.order_number,
                    illness: illness,
                    announcement_id: announcement.id
                };

                this.getBarcodes(body, illness);
                this.getInspectionLetter(body, illness);
                this.loadAnnounced();
                this.loadToReceiveLabResults();
            },
            err => {
                console.log(err);
            }
        )
    }

    /** Create a PDF file containing barcodes for all sheep in the live stock */
    private getBarcodes(body, illness){
        let win = window.open('/loading', '_blank');
        this.nsfoService.doPostRequest(this.nsfoService.URI_BARCODES , body)
            .subscribe(
                res => {
                    win.location.href = res.result;
                }
            );
    }

    /** Create an Inspection support letter */
    private getInspectionLetter(body, illness){
        let win = window.open('/loading', '_blank');
        this.nsfoService.doPostRequest(this.nsfoService.URI_INSPECTIONS_LETTERS , body)
            .subscribe(
                res => {
                    win.location.href = res.result;
                }
            );
    }

    /** Cancel an Announcement the Announcement will revert to the first swim lane */
    public cancelAnnouncement(announcement){
        let body = {
          new_status : "CANCELLED"
        };
        this.nsfoService.doDeleteRequest(this.nsfoService.URI_ANNOUNCEMENTS + '/' + announcement.id , body)
            .subscribe(
                res => {
                    this.loadAnnounced();
                    this.loadToAnnounce();
                },
                err => {
                  // handle error
                }
            );
    }

    /** Cancel an Inspection the Inspection will revert to the ... swim lane */
    public cancelInspection(inspection) {
      console.log(inspection);
      console.log('CANCELING INSPECTION');

      // return
      let body = {
          new_status : "CANCELLED"
      }
      return this.nsfoService.doPutRequest(this.nsfoService.URI_INSPECTIONS + '/' + inspection.inspection_id , body)
          .subscribe(
              res => {
                this.loadToAuthorize();
                this.loadFinished();
                this.loadToReceiveLabResults();
              },
              err => {
                // handle error
              }
          );
    }

    /** Finish (Authorize) an Inspection the Inspection will be shown in the the finished swim lane */
    public finishInspection(inspection) {
      let body = {
          new_status : "FINISHED"
      }
      return this.nsfoService.doPutRequest(this.nsfoService.URI_INSPECTIONS + '/' + inspection.inspection_id , body);
    }

    /** Create a single Announcement */
    public createAnnouncement(location){

      const illness = this.selectedIllness;

      this.orderNumber = undefined;
      console.log(location);
        this.toAnnounceIsLoading.next(true);
        let body = {
          illness: illness,
          ubn: location.ubn
        };
        this.nsfoService.doPostRequest(this.nsfoService.URI_ANNOUNCEMENTS + '/' + location.ubn , body)
            .subscribe(
                res => {
                    // TODO: result should come back as an object
                    // TODO: failed should come back as an object
                    console.log(' RES  = ');
                    console.log(res);

                    this.loadToAnnounce();
                    this.loadAnnounced();

                    if (res.result.result == "null") {

                        if (res.result.failed.order_number != null) {
                          this.orderNumber = res.result.failed.order_number;
                        }

                        //Failed
                        alert(res.result.failed.message);
											  return;
                    }

                    let body = {
                      ubn: res.result.result.location.ubn,
                      illness: illness,
                      order_number: res.result.result.order_number
                    };

                    console.log(res, body);
                    this.getAnnouncementLetter(body);
                },
                err => {
                  // handle error
                }
            );
    }

    /** create Multiple Announcements */
    public createAnnouncements(locations: Array<any>){
        this.toAnnounceIsLoading.next(true);

        const illness = this.selectedIllness;

        let testBatch = [
          locations[0],
          locations[1],
          locations[2],
          locations[3],
          locations[4]
        ];

        let toSend = [];
        for(let item of testBatch)
        {
            let body = {
              illness: illness,
              ubn: item.ubn
            };
            toSend.push(body);
        }

        this.nsfoService.doPostRequest(this.nsfoService.URI_ANNOUNCEMENTS, toSend)
            .subscribe(
                res => {
                    this.loadToAnnounce();
                    this.loadAnnounced();

                    let succesfull = res.result;
                    let failed = res.failed;

                    let lettersRequest = [];

                    for(let item of succesfull) {
                        let body = {
                            ubn: item.ubn,
                            illness: illness,
                            order_number: item.order_number
                        };
                        lettersRequest.push(body);
                    };
                    this.getAnnouncementLetters(lettersRequest);
                },
                err => {
                  // handle error
                  alert(this.nsfoService.getErrorMessage(err));
									this.toAnnounceIsLoading.next(false);
                }
            );
    }

    /** Create a batch of announcement pdf's for multiple ubn's */
    private getAnnouncementLetters(request){
        this.toAnnounceIsLoading.next(true);
        let win = window.open('/loading', '_blank');
        this.nsfoService.doPostRequest(this.nsfoService.URI_ANNOUNCEMENTS_LETTERS , request)
            .subscribe(
                res => {
                    // TODO: Check if failed array is filled
                    this.toAnnounceIsLoading.next(false);
                    win.location.href = res.result.download_url;

                }
            );
    }

    /** Create a single announcement pdf for a specific ubn */
    private getAnnouncementLetter(request){
        this.toAnnounceIsLoading.next(true);
        let win = window.open('/loading', '_blank');
        this.nsfoService.doPostRequest(this.nsfoService.URI_ANNOUNCEMENTS_LETTERS + '/' + request.ubn , request)
            .subscribe(
                res => {
                    // TODO: Check if failed
                    this.toAnnounceIsLoading.next(false);
                    win.location.href = res.result.download_url;
                }
            );
    }

    public updateInspectionStatus(inspection){

    }

    public updateHealthStatus(healthStatus){

    }

    public getLabResults(inspection: LocationHealthInspection){
        return this.nsfoService.doGetRequest(this.nsfoService.URI_LAB_RESULTS + '?inspectionId=' + inspection.inspection_id);
    }


    private getIllnessTypeQueryParam() {
      return HealthService.getIllnessTypeQueryParameterByIllnessType(this.selectedIllness);
    }


    public static getIllnessTypeQueryParameterByIllnessType(illnessType: string): string {
        switch (illnessType) {
          case _MAEDI_VISNA: return MAEDI_VISNA;
          case _SCRAPIE: return SCRAPIE;
          case _CAE: return CAE;
          case _CL: return CL;
          case _ROT: return ROT;
          default: console.error('INVALID ILLNESS TYPE INPUT');
        }
        return null;
    }
}
