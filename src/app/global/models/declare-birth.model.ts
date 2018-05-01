import { DeclareBirthResponse } from './declare-birth-response.model';
import { Animal } from '../components/livestock/livestock.model';
import { DeclareBase } from './declare-base.model';

export class DeclareBirth extends DeclareBase {
		/* currently not returned by api
		litter: Litter;
		location: Location;
		revoke: RevokeDeclaration; entity does not exist yet
		*/
		animal: Animal;
		uln_number: string;
		uln_country_code: string;
		gender: string;
		uln_father: string;
		uln_country_code_father: string;
		uln_mother: string;
		uln_country_code_mother: string;
		uln_surrogate: string;
		uln_country_code_surrogate: string;
		is_aborted: boolean;
		is_pseudo_pregnancy: boolean;
		has_lambar: boolean;
		date_of_birth: string;
		litter_size: number;
		birth_weight: number;
		birth_tail_length: number;
		responses: DeclareBirthResponse[];
}