import {LocationHealthInspection} from "../../main/health/health.model";
import {LabResult} from "./lab-result.model";

export class LabResultFile {
    public id: number;
    public inspection: LocationHealthInspection;
    public results: LabResult;
    public part: number;
    public revision: number;
    public illness: string;
    public lab_reference_number: string;
    public nsfo_reference_number: string;
    public filename: string;
    public lab_name: string;
    public sample_count: number;
}