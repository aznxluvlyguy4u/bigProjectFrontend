import {Injectable} from '@angular/core';

import {NSFOService} from '../nsfo/nsfo.service';
import {TaskService} from "../task/task.service";


@Injectable()
export class CalculateService {

    constructor(
        private nsfo: NSFOService,
        private taskService: TaskService
    ) {}

    private doTaskRequestByReportWorker(uri: string) {
        this.nsfo.doGetRequest(uri)
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
