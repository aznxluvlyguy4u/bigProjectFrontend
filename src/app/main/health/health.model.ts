export class AnimalHealthRequest {
    public request_id: string;
    public ubn: string;
    public name: string;
    public inspection: string;
    public request_date: string;
    public direction_date: string;
    public next_action: string;
    public action_taken_by: string;
    public sampling_date: string;
    public data: Direction[] = [];
    public total_lead_time: string;
    public authorized_by: string;
    public status: string;
}

class Direction {
    public type: string;
    public date: string;
}