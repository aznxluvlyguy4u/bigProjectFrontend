import _ = require("lodash");
import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {TranslatePipe, TranslateService} from "ng2-translate/ng2-translate";
import { LocationHealthInspection, Announcement, AnnouncementLocationOutput } from '../../../../health.model';
import {HealthService} from '../../../../health.service';
import { PaginatePipe, PaginationService } from 'ng2-pagination';
import { PaginationComponent } from '../../../../../../global/components/pagination/pagination.component';
import { InspectionLocationPipe } from '../../../../pipes/inspection-location.pipe';

@Component({
    selector: 'health-table-to-announce',
    template: require('./inspections.tableToAnnounce.html'),
    pipes: [TranslatePipe, PaginatePipe, InspectionLocationPipe],
    directives: [PaginationComponent],
    providers: [PaginationService]
})

export class HealthTableToAnnounce implements OnInit{
    private requests:any;
    private _isLoading: boolean;
    private _toAnnounce:Array<AnnouncementLocationOutput>;
    private editMode:boolean = false;

	  searchValue: string;

    @Output() inspectionsUpdate = new EventEmitter();
    @Output() _createAnnouncement = new EventEmitter();
    @Output() _createAnnouncements = new EventEmitter();

    @Input()
    set toAnnounce(toAnnounce: Array<AnnouncementLocationOutput>) {
        this._toAnnounce = toAnnounce || [];
    }
    get toAnnounce(): Array<AnnouncementLocationOutput> { return this._toAnnounce; }

    @Input()
    set isLoading(isLoading: boolean) {
        this._isLoading = isLoading;
    }

    constructor(private translate: TranslateService, private healthService: HealthService) {}

    ngOnInit(){ }

    private createAnnouncement(location: LocationHealthInspection): void {
        this._isLoading = true;
        this._createAnnouncement.emit(location)
    }

    private createAnnouncements(): void {
        this._isLoading = true;
        this._createAnnouncements.emit(this._toAnnounce);
    }

    getSearchParameters(): string[] {
        return [
          this.searchValue,
        ];
    }
}
