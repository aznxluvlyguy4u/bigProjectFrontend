import {Component, OnDestroy, OnInit} from '@angular/core';

import {TranslatePipe, TranslateService} from "ng2-translate";
import {PaginatePipe, PaginationService} from "ng2-pagination";
import {PaginationComponent} from "../pagination/pagination.component";
import {TaskRequest, UpdateType} from "../../services/task/task-request.model";
import {TaskService} from "../../services/task/task.service";
import {NSFOService} from "../../services/nsfo/nsfo.service";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-task-modal',
    template: require('./task-modal.component.html'),
    directives: [PaginationComponent],
    providers: [PaginationService],
    pipes: [PaginatePipe, TranslatePipe]
})

export class TaskModalComponent implements OnInit, OnDestroy {
    public taskRequestsShownInModal: TaskRequest[];
    private modalDisplay = 'none';
    public filterAmount: number = 5;
    public page: number =1;
	public title = 'TASK OVERVIEW';

	public isCancellingInbreedingCoefficient = false;

    private onDestroy$: Subject<void> = new Subject<void>();

    constructor(
        private nsfo: NSFOService,
        private translate: TranslateService,
        private taskService: TaskService) {
    }

    ngOnInit() {
        this.taskService.tasksShownInModelChanged
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
            (taskRequests: TaskRequest[]) => {
            this.taskRequestsShownInModal = taskRequests;
            this.closeIfEmpty();
            }
        );
        this.taskRequestsShownInModal = this.taskService.getTaskRequestsShownInModal();

        this.taskService.isModalActive
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
            (notifyUser: boolean) => {
                if (notifyUser) {
                    this.openModal();
                } else {
                    this.closeModal();
                }
            }
        );

        this.taskService.toggleIsModalActive
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(
            (toggleModal: boolean) => {
                if (toggleModal) {
                    this.toggleModal();
                }
            }
        );
    }

    ngOnDestroy() {
        this.onDestroy$.next();
    }

    public cancelInbreedingCoefficient() {

        if (!this.isCancellingInbreedingCoefficient) {
            this.isCancellingInbreedingCoefficient = true;
            this.nsfo.doDeleteRequest(this.nsfo.URI_DELETE_INBREEDING_COEFFICIENT_RECALCULATIONS_TASK, {})
                .finally(()=>{
                    this.isCancellingInbreedingCoefficient = false;
                    this.taskService.fetchTasks();
                })
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(
                    res => {
                        this.closeModal();
                    }, error => {
                        alert(this.nsfo.getErrorMessage(error));
                    }
                );
        }
    }

    public isInbreedingCoefficientTask(updateType: UpdateType): boolean {
        return updateType === UpdateType.INBREEDING_COEFFICIENT_CALCULATION ||
            updateType === UpdateType.INBREEDING_COEFFICIENT_RECALCULATION;
    }

    public getTaskTypeString(updateType: UpdateType) {
        switch (updateType) {
            case UpdateType.STAR_EWES:
                return this.translate.instant('CALCULATE STAR EWES');
            case UpdateType.INBREEDING_COEFFICIENT_CALCULATION:
                return this.translate.instant('CALCULATE INBREEDING COEFFICIENT');
            case UpdateType.INBREEDING_COEFFICIENT_RECALCULATION:
                return this.translate.instant('RECALCULATE INBREEDING COEFFICIENT');
            default:
                return this.translate.instant('TASK_UNKNOWN');
        }
    }

    closeIfEmpty() {
        if (this.taskRequestsShownInModal.length === 0) {
            this.closeModal();
        }
    }

    public openModal() {
        this.modalDisplay = 'block';
    }

    public closeModal() {
        this.modalDisplay = 'none';
    }

    public toggleModal() {
        if (this.modalDisplay === 'none') {
            this.openModal();
        } else {
            this.closeModal();
        }
    }

    public resetTaskList() {
        this.taskService.resetTaskList();
    }

    public isModalEmpty(): boolean {
        return this.taskService.isModalEmpty();
    }

    public hasFailedTasks() {
        return this.taskService.failedTasksCount > 0;
    }
}
