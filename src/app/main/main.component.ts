import {Component} from "@angular/core";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {NSFOService} from "../global/services/nsfo/nsfo.service";
import {Observable} from "rxjs/Rx";
import {Admin} from "./main.model";
import {UtilsService} from "../global/services/utils/utils.service";
import { DownloadService } from '../global/services/download/download.service';
import { DownloadModalComponent } from '../global/components/downloadmodal/download-modal.component';
import {ReportModalComponent} from "../global/components/reportmodal/report-modal.component";
import {ReportService} from "../global/services/report/report.service";
import { IS_INVOICES_ACTIVE } from '../global/constants/feature.activation';
import {TaskService} from "../global/services/task/task.service";

@Component({
    directives: [ROUTER_DIRECTIVES, DownloadModalComponent, ReportModalComponent],
    template: require('./main.component.html'),
    pipes: [TranslatePipe]
})

export class MainComponent {
    isActiveDownloadModal: boolean = false;

    public isActiveReportModal: boolean = false;
    public isActiveTaskModal: boolean = false;
    private isActiveSideMenu: boolean = false;
    private isActiveUserMenu: boolean = false;
    private admin: Admin = new Admin();
    private adminDetails$;

    public isInvoicesActive = IS_INVOICES_ACTIVE;

    constructor (
        private nsfo: NSFOService,
        private reportService: ReportService,
        private taskService: TaskService,
        private router: Router,
        private utils: UtilsService,
        private downloadService: DownloadService
    ) {
        this.getAdminDetails();
        this.validateToken();
    }

    private validateToken() {
        let request = {
            "env": "ADMIN"
        };

        this.nsfo.doPostRequest(this.nsfo.URI_VALIDATE_TOKEN, request)
            .subscribe(
                res => {},
                err => {this.router.navigate(['/login'])}
            );
    }
    
    private getAdminDetails() {
        this.adminDetails$ = this.utils.getAdminDetails()
            .subscribe(
                res => {
                    this.admin.first_name = res.first_name;
                    this.admin.last_name = res.last_name;
                    this.admin.email = res.email_address;
                    this.admin.access_level = res.access_level;
                });
    }

    isDeveloper() {
        return this.utils.isDeveloper;
    }

    private toggleSideMenu() {
        this.isActiveSideMenu = !this.isActiveSideMenu;
        this.isActiveUserMenu = false;
			  this.downloadService.closeDownloadModal();
    }

    private toggleUserMenu() {
        this.isActiveUserMenu = !this.isActiveUserMenu;
        this.isActiveSideMenu = false;
			  this.downloadService.closeDownloadModal();
    }

    private closeAllMenus() {
        this.isActiveSideMenu = false;
        this.isActiveUserMenu = false;
        this.downloadService.closeDownloadModal();
    }

    toggleDownloadModal() {
        this.downloadService.toggleDownloadModal();
        this.isActiveUserMenu = false;
        this.isActiveSideMenu = false;
    }

    downloadCount(): number {
        return this.downloadService.getDownloadsInModalCount();
    }

    isDownloadModalEmpty(): boolean {
        return this.downloadService.isModalEmpty();
    }

    toggleReportModal() {
        this.reportService.toggleReportModal();
        this.isActiveUserMenu = false;
        this.isActiveSideMenu = false;
    }

    isReportModalEmpty(): boolean {
        return this.reportService.isModalEmpty();
    }

    reportCount(): number {
        return this.reportService.getReportsInModalCount();
    }

    toggleTaskModal() {
        // this.taskService.toggleTaskModal();
        this.isActiveUserMenu = false;
        this.isActiveSideMenu = false;
    }

    taskCount(): number {
        return 1
        // return this.taskService.getTasksInModalCount();
    }

    isTaskModalEmpty(): boolean {
        return this.taskService.isModalEmpty();
    }

    private logout() {
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
    }
}
