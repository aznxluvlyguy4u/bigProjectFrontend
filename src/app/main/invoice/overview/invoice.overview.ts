import moment from "moment";
import {Component} from "@angular/core";
import {PaginationService, PaginatePipe} from "ng2-pagination/index";
import {PaginationComponent} from "../../../global/components/pagination/pagination.component";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {NSFOService} from "../../../global/services/nsfo/nsfo.service";
import {Invoice} from "../invoice.model"
import {SettingsService} from "../../../global/services/settings/settings.service";
import {Router} from "@angular/router";

@Component({
    providers: [PaginationService],
    directives: [PaginationComponent],
    templateUrl: '/app/main/invoice/overview/invoice.overview.html',
    pipes: [TranslatePipe, PaginatePipe]
})

export class InvoiceOverviewComponent {
    private invoices: Invoice[] = [];

    constructor(private nsfo: NSFOService, private settings: SettingsService, private router: Router) {
        this.getInvoicesList();
    }

    private getInvoicesList() {
        this.nsfo.doGetInvoices()
            .subscribe(
                res => {
                    this.invoices = <Invoice[]> res.result;
                }
            );
    }

    private calculateDays(date: string) {
        let now = moment();
        let end = moment(date);
        let duration = moment.duration(now.diff(end));
        return Math.floor(duration.asDays());
    }

    private navigateTo(url: string) {
        this.router.navigate([url]);
    }
}