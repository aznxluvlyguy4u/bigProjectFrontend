import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {SettingsService} from "../../../global/services/settings/settings.service";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";

@Component({
    template: require('./health.failedImports.html'),
    pipes: [TranslatePipe]
})

export class HealthFailedImportsComponent {
    private inspectionDocument: File;
    private failedImports = [];
    private isLoading = false;
    private isUploading = false;
    private selectedUBN = '';
    
    constructor(private settings: SettingsService, private nsfo: NSFOService) {
        this.getFailedImports();
    }

    private getFailedImports(): void {
        this.isLoading = true;
        this.nsfo.doGetRequest(this.nsfo.URI_HEALTH_INSPECTIONS + '/failed-results')
            .subscribe(
                res => {
                    this.failedImports = res.result;
                    this.isLoading = false;
                },
                err => {
                    this.isLoading = false;
                }
            )
    }

    private downloadFailedImport(url: string): void {
        window.open(url);
    }

    private addImportFile(event: Event, failedImport): void {
        let self = this;
        this.isUploading = true;
        this.inspectionDocument = event.target.files[0];
        let reader = new FileReader();

        reader.onload = function() {
            let encodedString = reader.result.split(',')[1];

            let request = {
                "filename": self.inspectionDocument.name,
                "type": self.inspectionDocument.type,
                "extension": self.getFileExtension(self.inspectionDocument.name),
                "content": encodedString,
                "failed_import_id": failedImport.failed_import_id,
                "illness": failedImport.illness
            };

            self.nsfo.doPutRequest(self.nsfo.URI_HEALTH_INSPECTIONS + '/failed-results', request)
                .subscribe(
                    res => {
                        let index = this.failedImports.indexOf(failedImport);
                        this.failedImports.splice(index, 1);
                        self.isUploading = false;
                    },
                    err => {
                        self.isUploading = false;
                    }
                );
        };
        reader.readAsDataURL(this.inspectionDocument);
    }
    
    private getFileExtension(filename: string): string {
        let  ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? "" : ext[1];
    }
}