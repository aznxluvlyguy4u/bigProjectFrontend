import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";

@Component({
    template: require('./health.erroneousCSV.html'),
    pipes: [TranslatePipe]
})

export class HealthErroneousCSVComponent {}