import {Animal} from "../components/livestock/livestock.model";

export class LabResult {
    public id: number;
    public animal:Animal;
    public animal_date_of_birth: string;
    public animal_uln_number: string;
    public animal_uln_country_code: string;
    public vet_name: string;
}

export class LabResultScrapie extends LabResult{
    sample_number:string;
    mgx_sample_id:string;
    genotype:string;
    genotype_with_codon_141:string;
    genotype_class:string;
    reception_date:string;
    result_date:string;
}

export class LabResultMaediVisna extends LabResult{
    inspection_id: string;
    sample_id: string;
    sub_ref:string;
    ci_name:string;
    result_date:string;
    mvnp: number;
    mv_c_a_e_pool:string;
    mv_cae_ira:string;
    mv_caegid:string;
}