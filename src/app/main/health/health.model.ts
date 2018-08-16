import { Location, NestedAnnouncementLocationOutput, User } from '../client/client.model';
import {Animal} from '../../global/components/livestock/livestock.model';
import { Person } from '../../global/models/person.model';
import {LabResultFile} from '../../global/models/lab-result-file.model';

export class LocationHealthInspection {
    public id: number;
    public request_id: string;
    public ubn: string;
    public last_name: string;
    public first_name: string;
    public inspection: string;
    public request_date: string;
    public direction_date: string;
    public next_action: string;
    public action_log: ActionLog;
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
    public illness_type: string;
    public location: Location;
    public animals: Animal[] = []
    public lab_result_files: LabResultFile[] = [];
}

export class ActionLog {
    public id: number;
    public logDate: string;
    public userAccount: Person;
    public actionBy: Person;
    public userActionType: string;
    public description: string;
    public isCompleted: boolean;
    public isUserEnvironment: boolean;
}

export class Announcement {
    public id: number;
    public actionLog: ActionLog;
    public request_date: string;
    action_taken_by: Person;
}

export class InspectionAnnouncement extends Announcement {
	  location: NestedAnnouncementLocationOutput;
	  status: string;
	  isInspectionInitiated: boolean;
	  orderNumber: string;
    ubn: string;
    illness_type: string;
	  first_name: string;
	  inspection: string;
}

export class Address {
    streetname_number:string;
    postal_code:string;
    city:string;
}

export class Owner {
    name:string;
    address:Address;
}

export class Veterinarian {
    name:string;
    address:Address;
    email_address:string;
}

export class Direction {
    public type: string;
    public date: string;
}

export class LabResult {
    public illness:string;
    public ubn:string;
    public owner:Owner;
    public veterinarian:Veterinarian;
    public lab_results:Array<LabResultItem>;
    public revision:number;
    public inspectionId:string;
}

export class LabResultItem {
    public animal:Animal;
}

export class LabResultScrapie extends LabResultItem{
    sample_number:string;
    mgx_sample_id:string;
    genotype:string;
    genotype_with_codon_141:string;
    genotype_class:string;
    reception_date:string;
    result_date:string;
}

export class LabResultMaediVisna extends LabResultItem{
    sub_ref:string;
    ci_name:string;
    date_sampled:string;
    mvnp:number;
    mv_cae_pool:string;
    mv_cae_ira:string;
    mv_caegid:string;
}

export class HealthStatus {
    status:string;
    check_date:string;
    reason_of_edit:string;
    illness:string;
}


export class AnnouncementLocationOutput {
    first_name: string;
    last_name: string;
    location_id: string;
    ubn: string;
    is_active: boolean;
    status: string;
    illness_type: string;
}