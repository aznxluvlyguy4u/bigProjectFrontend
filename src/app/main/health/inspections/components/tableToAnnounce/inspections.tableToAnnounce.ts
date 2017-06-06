import _ = require("lodash");
import {Component, Input, OnInit, Output, EventEmitter} from "@angular/core";
import {TranslatePipe, TranslateService} from "ng2-translate/ng2-translate";
import {LocationHealthInspection, Announcement} from "../../../health.model";
import {HealthService} from '../../../health.service';

@Component({
    selector: 'health-table-to-announce',
    template: require('./inspections.tableToAnnounce.html'),
    pipes: [TranslatePipe]
})

export class HealthTableToAnnounce implements OnInit{
    private requests:any;
    private isLoading:boolean;
    private _toAnnounce:Array<Announcement>;
    private editMode:boolean = false;

    @Output() inspectionsUpdate = new EventEmitter();
    @Output() _createAnnouncement = new EventEmitter();
    @Output() _createAnnouncements = new EventEmitter();

    @Input()
    set toAnnounce(toAnnounce: Array<Announcement>) {
        this._toAnnounce = toAnnounce || [];
    }
    get toAnnounce(): Array<Announcement> { return this._toAnnounce; }

    constructor(private translate: TranslateService) {}

    ngOnInit(){ }

    private createAnnouncement(location: LocationHealthInspection): void {
        this._createAnnouncement.emit(location)
    }

    private createAnnouncements(): void {
        console.log('FROM TABLE');
        this._createAnnouncements.emit(this._toAnnounce);
    }
}
