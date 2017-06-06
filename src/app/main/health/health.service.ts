import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { NSFOService } from '../../global/services/nsfo/nsfo.service';
import { LocationHealthInspection } from './health.model';

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

    public toAnnounce$ = this.toAnnounce.asObservable();
    public announced$ = this.announced.asObservable();
    public toReceiveLabResults$ = this.toReceiveLabResults.asObservable();
    public toAuthorize$ = this.toAuthorize.asObservable();
    public ongoing$ = this.ongoing.asObservable();
    public finished$ = this.finished.asObservable();
    public expired$ = this.expired.asObservable();
    public loadingState$ = this.loadingState.asObservable();

    private _dataStore: {
        toAnnounce:Array<Location>,
        announced:Array<LocationHealthInspection>,
        toReceiveLabResults:Array<LocationHealthInspection>,
        ongoing:Array<LocationHealthInspection>,
        toAuthorize:Array<LocationHealthInspection>,
        finished:Array<LocationHealthInspection>,
        expired:Array<LocationHealthInspection>,
        loadingState:boolean,
        isLoading:boolean
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
            isLoading:false
        };
    }

    /** Load Locations that need to be inspected soon and need to be Announced. and pass the latest result set in to the observable stream */
    public loadToAnnounce(illnessType: string){
        this.nsfoService.doGetRequest(this.nsfoService.URI_LOCATIONS_TO_ANNOUNCE + '&illnessType=' + illnessType)
            .subscribe(res => {
                this._dataStore.toAnnounce = res.result;
                this.toAnnounce.next(this._dataStore.toAnnounce);
            });
    }

    public fetchToAnnounce(){
        this.toAnnounce.next(this._dataStore.toAnnounce);
    }

    public loadAnnounced(illnessType: string){
        this.nsfoService.doGetRequest(this.nsfoService.URI_LOCATIONS_ANNOUNCED + '&illnessType=' + illnessType)
            .subscribe(res => {
                this._dataStore.announced = res.result;
                this.announced.next(this._dataStore.announced);
            });
    }

    public fetchAnnounced(){
        this.announced.next(this._dataStore.announced);
    }

    /** Load inspections waiting for the labresults coming in. and pass the latest result set in to the observable stream */
    public loadToReceiveLabResults(illnessType: string){
        this.nsfoService.doGetRequest(this.nsfoService.URI_INSPECTIONS_TO_RECEIVE_LAB_RESULTS + '&illnessType=' + illnessType)
            .subscribe(res => {
                this._dataStore.toReceiveLabResults = res.result;
                this.toReceiveLabResults.next(this._dataStore.toReceiveLabResults);
            });
    }

    public fetchToReceiveLabResults(){
        this.toReceiveLabResults.next(this._dataStore.toReceiveLabResults);
    }

    /** Load Inspectiones in need of Authorization and pass the latest result set in to the observable stream */
    public loadToAuthorize(illnessType: string){
        this.nsfoService.doGetRequest(this.nsfoService.URI_INSPECTIONS_TO_AUTHORIZE + '&illnessType=' + illnessType)
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
        this.nsfoService.doGetRequest(this.nsfoService.URI_INSPECTIONS_FINISHED)
            .subscribe(res => {
                this._dataStore.finished = res.result;
                this.finished.next(this._dataStore.finished);
            });
    }

    /** Load Expired inspections and pass the latest result set in to the observable stream */
    public loadExpired(){
        this.nsfoService.doGetRequest(this.nsfoService.URI_INSPECTIONS_EXPIRED)
            .subscribe(res => {
                this._dataStore.expired = res.result;
                this.expired.next(this._dataStore.expired);
            });
    }

    public fetchExpired(){
        this.expired.next(this._dataStore.expired);
    }

    /** Create a single LocationHealthInspection */
    public createInspection(announcement, illness: string){

      let inspection = {
          ubn: announcement.ubn,
          inspection_subject: illness,
          announcement_id: announcement.id,
          animal_count: announcement.animal_count
      }

      this.nsfoService.doPostRequest(this.nsfoService.URI_INSPECTIONS, inspection)
        .subscribe(
            res => {
                let result = res.result;
                let body = {
                    ubn: announcement.ubn,
                    order_number: result.order_number,
                    illness: illness,
                    announcement_id: announcement.id
                }

                this.getBarcodes(body, illness);
                this.getInspectionLetter(body, illness);
                this.loadAnnounced(illness);
                this.loadToReceiveLabResults(illness);
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
        console.log('CANCELING ANNOUNCEMENT');
    }

    /** Cancel an Inspection the Inspection will revert to the ... swim lane */
    public cancelInspection(inspection) {
      console.log('CANCELING INSPECTION');
    }

    /** Create a single Announcement */
    public createAnnouncement(location, illness: string){
        let body = {
          illness: illness,
          ubn: location.ubn
        };
        this.nsfoService.doPostRequest(this.nsfoService.URI_ANNOUNCEMENTS + '/' + location.ubn , body)
            .subscribe(
                res => {
                    // TODO: result should come back as an object
                    // TODO: failed should come back as an object
                    this.loadToAnnounce(illness);
                    this.loadAnnounced(illness);
                    let body = {
                        ubn: res.result.ubn,
                        illness: illness,
                        order_number: res.result.order_number
                    }
                    this.getAnnouncementLetter(body);
                },
                err => {
                  // handle error
                }
            );
    }

    /** create Multiple Announcements */
    public createAnnouncements(locations: Array<any>, illness: string){

        let testBatch = [
          locations[0],
          locations[1],
          locations[2],
          locations[3],
          locations[4]
        ]

        let toSend = [];
        for(let item of testBatch)
        {
            let body = {
              illness: illness,
              ubn: item.ubn
            }
            toSend.push(body);
        }

        this.nsfoService.doPostRequest(this.nsfoService.URI_ANNOUNCEMENTS, toSend)
            .subscribe(
                res => {
                    this.loadToAnnounce(illness);
                    this.loadAnnounced(illness);

                    let succesfull = res.result;
                    let failed = res.failed;

                    let lettersRequest = [];

                    for(let item of succesfull) {
                        let body = {
                            ubn: item.ubn,
                            illness: illness,
                            order_number: item.order_number
                        }
                        lettersRequest.push(body);
                    };

                    this.getAnnouncementLetters(lettersRequest);
                },
                err => {
                  // handle error
                }
            );
    }

    /** Create a batch of announcement pdf's for multiple ubn's */
    private getAnnouncementLetters(request){
        let win = window.open('/loading', '_blank');
        this.nsfoService.doPostRequest(this.nsfoService.URI_ANNOUNCEMENTS_LETTERS , request)
            .subscribe(
                res => {
                    // TODO: Check if failed array is filled
                    win.location.href = res.result.download_url;
                }
            );
    }

    /** Create a single announcement pdf for a specific ubn */
    private getAnnouncementLetter(request){
        let win = window.open('/loading', '_blank');
        this.nsfoService.doPostRequest(this.nsfoService.URI_ANNOUNCEMENTS_LETTERS + '/' + request.ubn , request)
            .subscribe(
                res => {
                    // TODO: Check if failed
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
}
