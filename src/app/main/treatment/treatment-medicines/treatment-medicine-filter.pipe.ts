import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'treatmentMedicineFilter'
})
export class TreatmentMedicineFilterPipe implements PipeTransform {

    transform(list: any, args: any[]): any {

        let search_input: string = args[0];
        let is_active_option: boolean = TreatmentMedicineFilterPipe.getBoolVal(args[1]);

        let filtered = list;

		// FILTER: SEARCH
		if (search_input) {
				const needle = args[0].toLowerCase();

				filtered = filtered.filter(treatmentMedicine => {

					let name = null;
					if (typeof treatmentMedicine.name === 'string') {
						name = treatmentMedicine.name.toLowerCase();
					}

					const haystack = name; // + add other variables to search in here

					return haystack.indexOf(needle) !== -1;
				});
		}

        //FILTER IS ACTIVE
		if (typeof is_active_option === 'boolean') {
			filtered = filtered.filter(treatmentMedicine => {
				return treatmentMedicine.is_active === is_active_option;
			});
		}

        return filtered
    }

    private static getBoolVal(string: string): any {
	switch (string) {
			case 'true': return true;
			case 'false': return false;
			default: return string;
		}
	}
}
