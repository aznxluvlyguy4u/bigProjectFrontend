import {Injectable} from '@angular/core';

import {NSFOService} from '../nsfo/nsfo.service';
import {TaskService} from "../task/task.service";
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class CalculateService {
    private requestSub: Subscription;

    constructor(
        private nsfo: NSFOService,
        private taskService: TaskService
    ) {}

    ngOnDestroy() {
        if (this.requestSub) {
            this.requestSub.unsubscribe();
        }
    }

    private doTaskRequestByReportWorker(uri: string) {
       this.requestSub = this.nsfo.doGetRequest(uri)
            .subscribe(
                res => {
                    this.taskService.fetchTasks();
                },
                error => {
                    alert(this.nsfo.getErrorMessage(error));
                }
            );
    }

    doStarEwesCalculationTaskGetRequest() {
        this.doTaskRequestByReportWorker(this.nsfo.URI_GET_STAR_EWES_CALCULATIONS_TASK);
    }

    doInbreedingCoefficientCalculationTaskGetRequest() {
        this.doTaskRequestByReportWorker(this.nsfo.URI_GET_INBREEDING_COEFFICIENT_CALCULATIONS_TASK);
    }

    doInbreedingCoefficientRecalculationTaskGetRequest() {
        this.doTaskRequestByReportWorker(this.nsfo.URI_GET_INBREEDING_COEFFICIENT_RECALCULATIONS_TASK);
    }
}