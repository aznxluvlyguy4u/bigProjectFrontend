import {User} from "../client/client.model";
export class AnimalHealthRequest {
    public request_id: string;
    public ubn: string;
    public last_name: string;
    public first_name: string;
    public inspection: string;
    public request_date: string;
    public direction_date: string;
    public next_action: string;
    public action_taken_by: User;
    public sampling_date: string;
    public data: Direction[] = [];
    public total_lead_time: string;
    public authorized_by: string;
    public status: string;
    public inspection_id: string;
}

class Direction {
    public type: string;
    public date: string;
}