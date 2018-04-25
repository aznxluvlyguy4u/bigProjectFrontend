import { Pipe, PipeTransform } from '@angular/core';
import { Location } from '../../../client/client.model';

@Pipe({
	name: 'animalBatchEditFilter'
})
export class AnimalsBatchEditFilterPipe implements PipeTransform {

	transform(list: any, args: any[]): any {

		let filterUln: string = args[0];
		let filterStn: string = args[1];
		let filterCollarNumber: string = args[2];
		let filterCollarColor: string = args[3];
		let filterNickName: string = args[4];
		let filterId: number = args[5];
		let filterAiind: number = args[6];
		let filterGenderType: string = args[7];
		let filterCurrentLocationUbn: string = args[8];
		let filterIsAlive: boolean = this.getBoolVal(args[9]);
		let filterNote: string = args[10];
		let filterUbnOfBirth: number = args[11];
		let filterLocationOfBirthUbn: string = args[12];
		let filterBreedType: string = args[13];
		let filterBreedCode: string = args[14];
		let filterPredicate: string = args[15];
		let filterPredicateScore: number = args[16];

		let filtered = list;

		// FILTER: ULN
		if (filterUln != null && filterUln != '') {
			const needle = filterUln.toLowerCase();

			filtered = filtered.filter(animal => {
				if (typeof animal.uln_country_code === 'string' && typeof animal.uln_number === 'string') {
					const haystack = (animal.uln_country_code + animal.uln_number).toLowerCase();
					return haystack.indexOf(needle) !== -1;
				}
				return false;
			});
		}

		// FILTER: STN
		if (filterStn != null && filterStn != '') {
			const needle = filterStn; // STNs are case sensitive

			filtered = filtered.filter(animal => {
				if (typeof animal.pedigree_country_code === 'string' && typeof animal.pedigree_number === 'string') {
					const haystack = (animal.pedigree_country_code + animal.pedigree_number);
					return haystack.indexOf(needle) !== -1;
				}
				return false;
			});
		}

		// FILTER: COLLAR NUMBER
		if (filterCollarNumber != null && filterCollarNumber != '') {
			const needle = filterCollarNumber.toLowerCase();

			filtered = filtered.filter(animal => {
				if (typeof animal.collar_number === 'string') {
					const haystack = animal.collar_number.toLowerCase();
					return haystack.indexOf(needle) !== -1;
				}
				return false;
			});
		}

		// FILTER: COLLAR COLOR
		if (filterCollarColor != null && filterCollarColor != '') {
			const needle = filterCollarColor.toLowerCase();

			filtered = filtered.filter(animal => {
				if (typeof animal.collar_color === 'string') {
					const haystack = animal.collar_color.toLowerCase();
					return haystack.indexOf(needle) !== -1;
				}
				return false;
			});
		}

		// FILTER: NICK NAME
		if (filterNickName != null && filterNickName != '') {
			const needle = filterNickName.toLowerCase();

			filtered = filtered.filter(animal => {
				if (typeof animal.nickname === 'string') {
					const haystack = animal.nickname.toLowerCase();
					return haystack.indexOf(needle) !== -1;
				}
				return false;
			});
		}

		// FILTER: ID
		if (filterId != null && filterId != 0) {
			const needle = filterId;

			filtered = filtered.filter(animal => {
				if (typeof animal.id === 'string') {
					const haystack = animal.id.toLowerCase();
					return haystack.indexOf(needle) !== -1;

				} else if (typeof animal.id === 'number') {
					const haystack = animal.id;
					return haystack.indexOf(needle) !== -1;
				}

				return false;
			});
		}

		// FILTER: AIIND
		if (filterAiind != null && filterAiind != 0) {
			const needle = filterAiind;

			filtered = filtered.filter(animal => {

				if (typeof animal.name === 'string') {
					const haystack = animal.name.toLowerCase();
					return haystack.indexOf(needle) !== -1;

				} else if (typeof animal.name === 'number') {
					const haystack = animal.name;
					return haystack.indexOf(needle) !== -1;
				}

				return false;
			});
		}

		// FILTER: Gender Type
		if (filterGenderType != null && filterGenderType != '') {
			filtered = filtered.filter(animal => {
				return animal.type.toLowerCase() === filterGenderType.toLowerCase();
			});
		}

		// FILTER: Current Location
		if (filterCurrentLocationUbn != null && filterCurrentLocationUbn != '') {
			const needle = filterCurrentLocationUbn.toString();

			filtered = filtered.filter(animal => {
				if (animal.location && animal.location.ubn) {
					const haystack = animal.location.ubn.toLowerCase();
					return haystack.indexOf(needle) !== -1;
				}
				return false;
			});
		}

		// FILTER: Location of Birth
		if (filterLocationOfBirthUbn != null && filterLocationOfBirthUbn != '') {
			const needle = filterLocationOfBirthUbn.toString();

			filtered = filtered.filter(animal => {
				if (animal.location_of_birth && animal.location_of_birth.ubn) {
					const haystack = animal.location_of_birth.ubn.toLowerCase();
					return haystack.indexOf(needle) !== -1;
				}
				return false;
			});
		}

		// FILTER: Note
		if (filterNote != null && filterNote != '') {
			const needle = filterNote.toLowerCase();

			filtered = filtered.filter(animal => {
				if (typeof animal.note === 'string') {
					const haystack = animal.note.toLowerCase();
					return haystack.indexOf(needle) !== -1;
				}
				return false;
			});
		}

		// FILTER: UBN OF BIRTH
		if (filterUbnOfBirth != null && filterUbnOfBirth != 0) {
			const needle = filterUbnOfBirth.toString();

			filtered = filtered.filter(animal => {
				if (typeof animal.ubn_of_birth === 'string') {
					const haystack = animal.ubn_of_birth.toLowerCase();
					return haystack.indexOf(needle) !== -1;
				}
				return false;
			});
		}

		// FILTER: BREED TYPE
		if (filterBreedType != null && filterBreedType != '') {
			const needle = filterBreedType.toLowerCase();

			filtered = filtered.filter(animal => {
				if (typeof animal.breed_type === 'string') {
					const haystack = animal.breed_type.toLowerCase();
					return haystack.indexOf(needle) !== -1;
				}
				return false;
			});
		}

		// FILTER: BREED CODE
		if (filterBreedCode != null && filterBreedCode != '') {
			const needle = filterBreedCode.toLowerCase();

			filtered = filtered.filter(animal => {
				if (typeof animal.breed_code === 'string') {
					const haystack = animal.breed_code.toLowerCase();
					return haystack.indexOf(needle) !== -1;
				}
				return false;
			});
		}

		// FILTER: PREDICATE
		if (filterPredicate != null && filterPredicate != '') {
			const needle = filterPredicate.toLowerCase();

			filtered = filtered.filter(animal => {
				if (typeof animal.predicate === 'string') {
					const haystack = animal.predicate.toLowerCase();
					return haystack.indexOf(needle) !== -1;
				}
				return false;
			});
		}

		// FILTER: PREDICATE SCORE
		if (filterPredicateScore != null && filterPredicateScore != 0) {
			filtered = filtered.filter(animal => {
				if (typeof animal.predicate_score === 'number') {
					return animal.predicate_score === filterPredicateScore;
				}
				return false;
			});
		}

		// FILTER: IS ALIVE
		if (typeof filterIsAlive === 'boolean') {
			filtered = filtered.filter(animal => {
				return animal.is_alive === filterIsAlive;
			});
		}

		return filtered
	}


	private getBoolVal(string: string): any {
		switch (string) {
			case 'true': return true;
			case 'false': return false;
			default: return string;
		}
	}

}