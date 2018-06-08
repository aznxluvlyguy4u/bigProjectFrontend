import moment = require("moment");
import {Component} from "@angular/core";
import {PaginationService, PaginatePipe} from "ng2-pagination/index";
import {PaginationComponent} from "../../../global/components/pagination/pagination.component";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {Invoice} from "../invoice.model"
import {invoiceFilterPipe} from "./pipes/invoiceFilter.pipe";
import {SettingsService} from "../../../global/services/settings/settings.service";
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {DownloadService} from "../../../global/services/download/download.service";

@Component({
    providers: [PaginationService],
    directives: [PaginationComponent, ROUTER_DIRECTIVES],
    template: require('./invoice.overview.html'),
    pipes: [TranslatePipe, PaginatePipe, invoiceFilterPipe]
})

export class InvoiceOverviewComponent {
    private selectedInvoice: Invoice;
    private displayModal: string = 'none';
    private invoices: Invoice[] = [];
    private isLoaded: boolean = false;
    private filterSearch: string = '';
    private status: string = 'ALL';
    private filterAmount: number = 10;
    private showBatch: string = "no";

    constructor(private nsfo: NSFOService, private settings: SettingsService, private router: Router, private downloadService: DownloadService) {
        this.getInvoicesList();
    }

    private getInvoicesList() {
        this.nsfo.doGetRequest(this.nsfo.URI_INVOICE)
            .subscribe(
                res => {
                    this.invoices = <Invoice[]> res.result;
                    this.isLoaded = true;
                }
            );
    }

    openModal(invoice: Invoice) {
        this.selectedInvoice = invoice;
        this.displayModal = 'block';
    }

    closeModal() {
        this.displayModal = 'none';
    }

    setInvoicePaid() {
        this.selectedInvoice.status = "PAID";
        this.nsfo.doPutRequest(this.nsfo.URI_INVOICE + "/" + this.selectedInvoice.id, this.selectedInvoice).subscribe(
            res => {
                this.closeModal();
                this.getInvoicesList();
            }
        )
    }

    private calculateDays(date: string) {
        let now = moment();
        let end = moment(date);
        let duration = moment.duration(now.diff(end));
        if (Math.floor(duration.asDays()) !== -1) {
            return Math.floor(duration.asDays());
        }
        return 0;
    }

    private navigateTo(url: string) {
        this.router.navigate([url]);
    }

    public downloadPdf(invoice: Invoice) {
        this.downloadService.doInvoicePdfGetRequest(invoice);
    }
}