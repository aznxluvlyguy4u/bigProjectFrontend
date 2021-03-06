import moment = require("moment");
import {Pipe, PipeTransform} from "@angular/core";
import {SettingsService} from "../../../services/settings/settings.service";

@Pipe({
    name: 'livestockFilter'
})

export class LivestockFilterPipe implements PipeTransform {

    private view_date_format;

    constructor(settings: SettingsService) {
        this.view_date_format = settings.getViewDateFormat();
    }

    transform(value:any, args: string[]): any {
        let search_query = args[0];
        let start_date = args[1];
        let end_date = args[2];
        let gender = args[3];
        let genotype = args[4];
        let filtered = value;

        for(let item of filtered) {
            item.filtered = false;
        }

        // Filter: Search Field
        if (search_query != null) {
            search_query = args[0].toLocaleUpperCase();
            filtered = filtered.filter(animal => (
                animal.uln +
                animal.pedigree +
                animal.date_of_birth +
                animal.gender +
                animal.work_number +
                animal.collar_number +
                animal.inflow_date
            ).indexOf(search_query) !== -1);
        }

        // Filter: Date
        if(start_date != null) {
            if(start_date.length > 0 && (end_date == null || end_date.length == 0)) {
                filtered = filtered.filter(animal => {
                    return moment(animal.date_of_birth, this.view_date_format) >= moment(start_date, this.view_date_format)
                });
            }
        }

        if(end_date != null) {
            if ((start_date == null || start_date.length == 0) && end_date.length > 0) {
                filtered = filtered.filter(animal => {
                    return moment(animal.date_of_birth, this.view_date_format) <= moment(end_date, this.view_date_format)
                });
            }
        }

        if(start_date != null && end_date != null) {
            if(start_date.length > 0 && end_date.length > 0) {
                filtered = filtered.filter(animal => {
                    return (moment(animal.date_of_birth, this.view_date_format) >= moment(start_date, this.view_date_format)) && (moment(animal.date_of_birth, this.view_date_format) <= moment(end_date, this.view_date_format))
                });
            }
        }

        // Filter: Genotype
        if(genotype != 'ALL') {
            filtered = filtered.filter(animal => {
                return animal.scrapie_genotype == genotype
            });
        }

        // Filter: Gender
        if(gender != 'ALL') {
            filtered = filtered.filter(animal => {
                return animal.gender == gender
            });
        }

        for(let item of filtered) {
            item.filtered = true;
        }
        
        return filtered
    }
}