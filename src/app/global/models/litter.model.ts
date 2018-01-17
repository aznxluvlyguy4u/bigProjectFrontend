import { DeclareNsfoBase } from './declare-nsfo-base.model';
import { Animal } from '../components/livestock/livestock.model';
import { DeclareBirth } from './declare-birth.model';
import { Stillborn } from './stillborn.model';

export class Litter extends DeclareNsfoBase {
		/* variables currently not returned from api
		mate: Mate; entity does not exist yet
		litter_ordinal: number;
		children: Animal[] = [];
		 */
		id: number;
		litter_date: string;
		animal_father: Animal;
		animal_mother: Animal;
		stillborn_count: number;
		born_alive_count: number;
		is_abortion: boolean;
		is_pseudo_pregnancy: boolean;
		declare_births: DeclareBirth[] = [];
		status: string;
		stillborns: Stillborn[] = [];
		type: string;
}