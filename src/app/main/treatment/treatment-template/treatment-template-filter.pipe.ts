import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'treatmentTemplateFilter'
})
export class TreatmentTemplateFilterPipe implements PipeTransform {

    transform(list: any, args: any[]): any {

        let search_input: string = args[0];
        let is_active_option: boolean = this.getBoolVal(args[1]);

        let filtered = list;

				// FILTER: SEARCH
				if (search_input) {
						const needle = args[0].toLowerCase();

						filtered = filtered.filter(treatmentTemplate => {

							let description = null;
							if (typeof treatmentTemplate.description === 'string') {
								description = treatmentTemplate.description.toLowerCase();
							}

							let haystack = description; // + add other variables to search in here

							if (treatmentTemplate.medications != null) {
								for(let medication of treatmentTemplate.medications) {
									if (typeof medication.description === 'string') {
										haystack = haystack + medication.description.toLowerCase();
									}
								}
							}

							return haystack.indexOf(needle) !== -1;
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
