import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {CKEditor} from 'ng2-ckeditor';
import {NSFOService} from "../../../../../global/services/nsfo/nsfo.service";
import {HealthLetter} from "../../../config.model";
import {SettingsService} from "../../../../../global/services/settings/settings.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

declare var $;

@Component({
    directives: [ROUTER_DIRECTIVES],
    template: require('./scrapie.announcement.html'),
    pipes: [TranslatePipe]
})

export class ScrapieAnnouncementComponent {
    private isSaving: boolean = false;
    private illness: string = 'scrapie';
    private letter_type: string = 'announcement';
    private letter: HealthLetter = new HealthLetter();
    private isLoaded: boolean = false;

    private onDestroy$: Subject<void> = new Subject<void>();

    private editorConfig = {
        language: 'nl',
        resize_enabled: false,
        height: 400,
        toolbar: [
            { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike'] },
            { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote'] },
            { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
            { name: 'document', items: ['Source'] }
        ]
    };

    constructor(private nsfo: NSFOService, private settings: SettingsService) {
        this.getHTMLData();
    }

    ngAfterViewInit() {

    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    private getHTMLData(): void {
        this.isSaving = true;
        this.nsfo.doGetRequest(this.nsfo.URI_ANNOUNCEMENTS_LETTER_TEMPLATES + '?illness_type=' + this.illness)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
                res => {
                    this.letter = res.result;
                    if (!this.isLoaded) {
                        CKEDITOR.replace('scrapie_announcement_editor', this.editorConfig);
                        CKEDITOR.instances.scrapie_announcement_editor.on('instanceReady', this.loadCSS);
                        this.isLoaded = true;
                    }
                    CKEDITOR.instances.scrapie_announcement_editor.setData(res.result.html);
                    this.loadCSS();

                    this.isSaving = false;
                },
                error => {
                    if (!this.isLoaded) {
                        CKEDITOR.replace('scrapie_announcement_editor', this.editorConfig);
                        CKEDITOR.instances.scrapie_announcement_editor.on('instanceReady', this.loadCSS);
                        this.isLoaded = true;
                    }
                    CKEDITOR.instances.scrapie_announcement_editor.setData("");
                    this.loadCSS();

                    this.isSaving = false;
                }
            )
    }

    private loadCSS() {
        $('iframe')
            .contents()
            .find("head")
            .append($("<style type='text/css'>  p{line-height: 1.5 !important; margin: 0; padding: 0;}  </style>"));
    }

    private save(): void {
        this.isSaving = true;
        let request = {
            "illness_type": this.illness.toLocaleUpperCase(),
            "letter_type": this.letter_type,
            "html": CKEDITOR.instances.scrapie_announcement_editor.getData()
        };

        this.nsfo.doPostRequest(this.nsfo.URI_ANNOUNCEMENTS_LETTER_TEMPLATES, request)
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
                res => {
                    this.getHTMLData();
                },
                err => {}
            );
    }
}