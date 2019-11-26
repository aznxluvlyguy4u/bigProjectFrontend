abstract class TaskWorker {
	public id: number;
	started_at: string;
	finished_at: string;
	worker_type: number;
	public error_code: number;
	public error_message: string;
}

export class TaskRequest extends TaskWorker {
	download_url: string;
	hash: string;
	update_type: UpdateType;
}

export enum UpdateType {
  STAR_EWES = 1
}
