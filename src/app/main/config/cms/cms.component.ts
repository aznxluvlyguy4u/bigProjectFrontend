import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {CKEditor} from 'ng2-ckeditor';
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";

declare var $;

@Component({
    template: require('./cms.component.html'),
    pipes: [TranslatePipe]
})

export class ConfigCMSComponent {
    private isSaved: boolean = false;
    private hasFailed: boolean = false;
    private savingInProgress: boolean = false;
    private isLoaded: boolean = false;

    private editorConfig = {
        language: 'nl',
        resize_enabled: false,
        toolbar: [
            { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike'] },
            { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote'] },
            { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
            { name: 'document', items: ['Source'] }
        ]
    };

    constructor(private nsfo: NSFOService) {
        this.getCMSData();
    }

    ngAfterViewInit() {

    }

    private getCMSData() {
        this.nsfo.doGetRequest(this.nsfo.URI_CMS)
            .subscribe(res => {
                if (!this.isLoaded) {
                    CKEDITOR.replace('dashboardtext', this.editorConfig);
                    CKEDITOR.instances.dashboardtext.on('instanceReady', this.loadCSS);
                    CKEDITOR.replace('contacttext', this.editorConfig);
                    CKEDITOR.instances.contacttext.on('instanceReady', this.loadCSS);
                    this.isLoaded = true;
                }
                CKEDITOR.instances.dashboardtext.setData(res.result.dashboard);
                CKEDITOR.instances.contacttext.setData(res.result.contact_info);
                this.loadCSS();
            });
    }

    private loadCSS() {
        $('iframe')
            .contents()
            .find("head")
            .append($("<style type='text/css'>  p{line-height: 1.5 !important; margin: 0; padding: 0;}  </style>"));
    }

    private save() {
        this.savingInProgress = true;
        this.isSaved = false;
        this.hasFailed = false;
        let request = {
            "dashboard": CKEDITOR.instances.dashboardtext.getData(),
            "contact_info": CKEDITOR.instances.contacttext.getData()
        };

        this.nsfo.doPutRequest(this.nsfo.URI_CMS, request)
            .subscribe(
                res => {
                    this.isSaved = true;
                    this.savingInProgress = false;
                },
                err => {
                    this.hasFailed = true;
                    this.savingInProgress = false;
                }
            );
    }
}
