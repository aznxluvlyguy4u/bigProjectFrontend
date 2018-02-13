import { Animal } from '../../../global/components/livestock/livestock.model';

export class AnimalsResult {
		ulns_without_found_animals: string[];
		stns_without_found_animals: string[];
		invalid: string[];
		animals: Animal[];
}