import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
// import {CKEditor} from "ng2-ckeditor/CKEditor";

@Component({
    // directives: [CKEditor],
    template: require('./health.letters.html'),
    pipes: [TranslatePipe]
})

export class HealthLettersComponent {
    private ckeditorContent: string = "";
}
