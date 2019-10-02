import {Component, EventEmitter} from "@angular/core";
import {BooleanSwitchComponent} from "../../../../global/components/booleanswitch/boolean-switch.component";
import {DatepickerV2Component} from "../../../../global/components/datepickerV2/datepicker-v2.component";
import {TranslatePipe} from "ng2-translate";
import {CLIENT_NOTES_OVERVIEW_REPORT} from "../../../../global/constants/report-type.constant";
import {DownloadService} from "../../../../global/services/download/download.service";
import {SettingsService} from "../../../../global/services/settings/settings.service";
import {PedigreeRegister} from "../../../../global/models/pedigree-register.model";
import { PedigreeRegisterDropdownComponent } from "../../../../global/components/pedigreeregisterdropdown/pedigree-register-dropdown.component";

@Component({
    selector: 'app-client-notes-overview',
    template: require('./client-notes-overview.component.html'),
    directives: [BooleanSwitchComponent, DatepickerV2Component, PedigreeRegisterDropdownComponent],
    pipes: [TranslatePipe]
})
export class ClientNotesOverviewComponent {
    title = CLIENT_NOTES_OVERVIEW_REPORT;

    referenceDateString: string;
    mustHaveAnimalHealthSubscription: boolean;
    pedigreeRegister: PedigreeRegister;

    initialValuesChanged = new EventEmitter<boolean>();

    constructor(private downloadService: DownloadService, public settings: SettingsService) {}

    ngOnInit() {
        this.referenceDateString = SettingsService.getDateString_YYYY_MM_DD_fromDate();
        this.mustHaveAnimalHealthSubscription = false;
        this.pedigreeRegister = null;
    }

    updateReferenceDateString($event) {
        this.referenceDateString = SettingsService.getDateString_YYYY_MM_DD_fromDate(new Date($event));
    }

    notifyInputValues() {
        this.initialValuesChanged.emit(true);
    }

    download() {
        this.notifyInputValues();
        this.downloadService.doClientNotesOverviewReportRequest(
            this.referenceDateString,
            this.mustHaveAnimalHealthSubscription,
            (this.pedigreeRegister != null ? this.pedigreeRegister.abbreviation : null)
        );
    }
}
