import {Component, OnDestroy, OnInit} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';
import {TranslatePipe, TranslateService} from "ng2-translate";
import {PaginatePipe, PaginationService} from "ng2-pagination";
import {PaginationComponent} from "../pagination/pagination.component";
import {TaskRequest, UpdateType} from "../../services/task/task-request.model";
import {TaskService} from "../../services/task/task.service";

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
    private taskRequestSubscription: Subscription;
    private isModalActiveSubscription: Subscription;
    private toggleModalSubscription: Subscription;
    public filterAmount: number = 5;
    public page: number =1;
	public title = 'TASK OVERVIEW';

    constructor(
        private translate: TranslateService,
        private taskService: TaskService) {
    }


    ngOnInit() {

        this.taskRequestSubscription = this.taskService.tasksShownInModelChanged.subscribe(
            (taskRequests: TaskRequest[]) => {
            this.taskRequestsShownInModal = taskRequests;
            this.closeIfEmpty();
            }
        );
        this.taskRequestsShownInModal = this.taskService.getTaskRequestsShownInModal();

        this.isModalActiveSubscription = this.taskService.isModalActive.subscribe(
            (notifyUser: boolean) => {
                if (notifyUser) {
                    this.openModal();
                } else {
                    this.closeModal();
                }
            }
        );

        this.toggleModalSubscription = this.taskService.toggleIsModalActive.subscribe(
            (toggleModal: boolean) => {
                if (toggleModal) {
                    this.toggleModal();
                }
            }
        );
    }

    public getTaskTypeString(updateType: UpdateType) {
        switch (updateType) {
            case UpdateType.STAR_EWES:
                return this.translate.instant('CALCULATE STAR EWES');
            default:
                return this.translate.instant('TASK_UNKNOWN');
        }
    }

    closeIfEmpty() {
        if (this.taskRequestsShownInModal.length === 0) {
            this.closeModal();
        }
    }

    ngOnDestroy() {
        this.taskRequestSubscription.unsubscribe();
        this.isModalActiveSubscription.unsubscribe();
        this.toggleModalSubscription.unsubscribe();
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
