import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";

@Component({
    templateUrl: '/app/main/health/uploadCSV/health.uploadCSV.html',
    pipes: [TranslatePipe]
})

export class HealthUploadCSVComponent {
    private inspectionDocument: File;
    private uploadIsSuccessful: boolean = false;

    private selectFile(event): void {
        this.inspectionDocument = event.target.files[0];
    }

    private openFile(): void {
        let url = URL.createObjectURL(this.inspectionDocument);
        window.open(url);
    }

    private removeFile(): void {
        this.inspectionDocument = null;
    }
}