import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {SettingsService} from "../../../global/services/settings/settings.service";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";

@Component({
    template: require('./health.failedImports.html'),
    pipes: [TranslatePipe]
})

export class HealthFailedImportsComponent {
    private failedCSVs = [];
    
    constructor(private settings: SettingsService, private nsfo: NSFOService) {}

    private downloadCSV(url: string): void {
        window.open(url);
    }

    private uploadCSV(event: Event): void {
        // When Success
        // Remove from array
    }
}