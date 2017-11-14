import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'treatmentTypeFilter'
})
export class TreatmentTypeFilterPipe implements PipeTransform {

    transform(list: any, args: any[]): any {

        let search_input: string = args[0];
        let type_option: string = args[1];
        let is_active_option: boolean = this.getBoolVal(args[2]);

        let filtered = list;

				// FILTER: SEARCH
				if (search_input) {
						const needle = args[0].toLowerCase();

						filtered = filtered.filter(treatmentType => {

							let description = null;
							if (typeof treatmentType.description === 'string') {
								description = treatmentType.description.toLowerCase();
							}

							const haystack = description; // + add other variables to search in here

							return haystack.indexOf(needle) !== -1;
						});
				}

				// FILTER: TYPE
				if (type_option !== 'ALL' && type_option !== null) {
						type_option = type_option.toLowerCase();
						filtered = filtered.filter(treatmentType => {
								return treatmentType.type.toLowerCase().indexOf(type_option) !== -1;
						});
				}

        // FILTER IS ACTIVE
				if (typeof is_active_option === 'boolean') {
						filtered = filtered.filter(treatmentType => {
								return treatmentType.is_active === is_active_option;
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
