import {User} from "../client/client.model";
import {Animal} from "../../global/components/livestock/livestock.model";

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
    public certification_status: string;
    public roadmap: string;
    public status: string;
    public order_number: string;
    public is_canceled: boolean;
    public inspection_id: string;
    public animals: Animal[] = []
}

class Direction {
    public type: string;
    public date: string;
}