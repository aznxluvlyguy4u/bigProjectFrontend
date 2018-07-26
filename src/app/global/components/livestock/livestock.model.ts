import { Litter } from '../../models/litter.model';
import { Ewe } from '../../models/ewe.model';
import { Ram } from '../../models/ram.model';
import { PedigreeRegister } from '../../models/pedigree-register.model';

export class Animal {
    id?: number;
	  creation_date?: string;
    uln_country_code?: string;
    uln_number?: string;
    animal_order_number?: string;
    uln?: string;
    nickname?: string;
    location?: Location;
    location_of_birth?: Location;
    pedigree_country_code?: string;
    pedigree_number?: string;
    ubn_of_birth?: string;
    animal_type?: number;
    is_alive?: boolean;
    lambar?: boolean;
    note?: string;
    myo_max?: string;
    blindness_factor?: string;
    predicate?: string;
    predicate_score?: number;
    heterosis?: number;
    recombination?: number;
    breed_type?: string;
    breed_code?: string;
    pedigree?: string;
    work_number?: string;
	  collar_color?: string;
    collar_number?: string;
    n_ling?: number;
	  merged_n_ling?: number;
    name?: string;
    date_of_birth?: string;
    date_of_death?: string;
    litter?: Litter;
    parent_mother?: Ewe;
    parent_father?: Ram;
    surrogate?: Ewe;
    gender?: string;
    scrapie_genotype?: string;
    pedigree_register?: PedigreeRegister;
    inflow_date?: string;
    birth_progress?: string;
    date_of_birth_sort?: string;
    ulnLastFive?: string;
    selected?: boolean;
    filtered?: boolean;
    type?: string;
    merged_n_ling: number;
}