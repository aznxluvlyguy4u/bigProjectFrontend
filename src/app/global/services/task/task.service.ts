import {Injectable, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import { NSFOService } from '../nsfo/nsfo.service';
import {TaskRequest} from "./task-request.model";
import * as _ from 'lodash';
import {Subscription} from "rxjs/Subscription";

@Injectable()
export class TaskService implements OnInit {

  isModalActive = new Subject<boolean>();
  toggleIsModalActive = new Subject<boolean>();
  tasksShownInModelChanged = new Subject<TaskRequest[]>();
  failedTasksCount: number;
  private TaskRequestShownInModal: TaskRequest[];
  private isFirstFetch = true;

  private requestSub: Subscription;

  constructor(private nsfo: NSFOService) {
      this.resetTaskList();
      this.fetchTasks();
  }

  ngOnInit() {
  }

    ngOnDestroy() {
      this.requestSub.unsubscribe();
    }

  fetchTasks() {
    this.requestSub = this.nsfo.doGetRequest(this.nsfo.URI_GET_TASKS).subscribe((res) => {
        this.resetTaskList();
        const TaskRequest: TaskRequest[] = res.result;
        TaskRequest.forEach((report) => {
            this.TaskRequestShownInModal.push(report);
        });
        this.tasksShownInModelChanged.next(this.TaskRequestShownInModal.slice());

        const hasUnfinished = _.filter(this.TaskRequestShownInModal, function (taskRequest: TaskRequest) {
            return (!taskRequest.finished_at);
        });
        if (hasUnfinished.length > 0) {
            setTimeout(() => {
                this.fetchTasks();
            }, 30000);
        } else {
            if (this.TaskRequestShownInModal.length > 0 && !this.isFirstFetch) {
                this.updateModalNotificationStatus(true);
            }
        }
        this.isFirstFetch = false;
    });
  }

  resetTaskList() {
    this.TaskRequestShownInModal = [];
    this.failedTasksCount = 0;
  }

  getTaskRequestsShownInModal(): TaskRequest[] {
    return this.TaskRequestShownInModal;
  }

  getTasksInModalCount(): number {
    return this.TaskRequestShownInModal.length;
  }

  isModalEmpty(): boolean {
    return this.getTasksInModalCount() === 0;
  }

  public openTaskModal() {
    this.updateModalNotificationStatus(true);
  }

  public closeTaskModal() {
    this.updateModalNotificationStatus(false);
  }

  public toggleTaskModal() {
    this.toggleIsModalActive.next(true);
  }

  private updateModalNotificationStatus(openModal: boolean) {
    this.isModalActive.next(openModal);
  }
}
