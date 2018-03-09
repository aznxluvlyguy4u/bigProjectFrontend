import { Litter } from '../../models/litter.model';
import { Ewe } from '../../models/ewe.model';
import { Ram } from '../../models/ram.model';
import { PedigreeRegister } from '../../models/pedigree-register.model';

export class Animal {
    public id: number;
	  public creation_date: string;
    public uln_country_code: string;
    public uln_number: string;
    public animal_order_number: string;
    public uln: string;
    public nickname: string;
    public location: Location;
    public location_of_birth: Location;
    public pedigree_country_code: string;
    public pedigree_number: string;
    public ubn_of_birth: string;
    public animal_type: number;
    public is_alive: boolean;
    public lambar: boolean;
    public note: string;
    public myo_max: string;
    public blindness_factor: string;
    public predicate: string;
    public predicate_score: number;
    public heterosis: number;
    public recombination: number;
    public breed_type: string;
    public breed_code: string;
    public pedigree: string;
    public work_number: string;
	  public collar_color: string;
    public collar_number: string;
    public n_ling: number;
    public name: string;
    public date_of_birth: string;
    public date_of_death: string;
    public litter: Litter;
    public parent_mother: Ewe;
    public parent_father: Ram;
    public surrogate: Ewe;
    public gender: string;
    public scrapie_genotype: string;
    public pedigree_register: PedigreeRegister;
    public inflow_date: string;
    public birth_progress: string;
    public date_of_birth_sort: string;
    public ulnLastFive: string;
    public selected: boolean;
    public filtered: boolean;
    public type: string;
}