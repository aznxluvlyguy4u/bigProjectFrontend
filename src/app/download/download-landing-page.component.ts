import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";

@Component({
    template: require('./download-landing-page.component.html'),
    pipes: [TranslatePipe]
})

export class DownloadLandingPageComponent{}