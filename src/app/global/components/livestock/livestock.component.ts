import _ = require("lodash");
import {Component, Input, Output, EventEmitter} from "@angular/core";
import {PaginationService, PaginatePipe} from "ng2-pagination/index";
import {PaginationComponent} from "../pagination/pagination.component";
import {Datepicker} from "../datepicker/datepicker.component";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import {LivestockOrderBy} from "./pipes/livestockSort";
import {LivestockFilterPipe} from "./pipes/livestockFilter";
import {Animal} from "./livestock.model";
import {SettingsService} from "../../services/settings/settings.service";

@Component({
    selector: 'livestock-overview',
    providers: [PaginationService],
    directives: [Datepicker, PaginationComponent],
    template: require('./livestock.component.html'),
    pipes: [TranslatePipe, LivestockFilterPipe, LivestockOrderBy, PaginatePipe]
})


export class LivestockComponent {
    private selectionList = <Animal[]>[];
    private selectionColumnOne: string = 'GENDER';
    private selectionColumnTwo: string = 'DATE OF BIRTH';
    private isASCColumnULNOrder: boolean = true;
    private isASCColumnOneOrder: boolean = true;
    private isASCColumnTwoOrder: boolean = true;

    @Input() animals: Animal[] = [];
    @Input() scrapieGenotypes: string[] = [];
    @Input() itemsPerPage: number = 10;
    @Output() selected = new EventEmitter();

    constructor(private settings: SettingsService){}

    private selectAnimal(event: Event, animal: Animal) {
        if(event.target.checked) {
            animal.selected = true;
            this.selectionList.push(animal);
        }

        if(!event.target.checked) {
            animal.selected = false;
            let index = this.selectionList.indexOf(animal);
            this.selectionList.splice(index, 1);
        }

        this.selected.emit(this.selectionList);
    }

    private selectAllAnimals(event: Event) {
        if(event.target.checked) {
            for(let animal of this.animals) {
                if(animal.filtered) {
                    this.selectAnimal(event, animal);
                }
            }
        }

        if(!event.target.checked) {
            for(let animal of this.animals) {
                this.selectAnimal(event, animal);
            }
        }
    }

    private getSelectionValue(selection, animal: Animal) {
        switch(selection) {
            case 'PEDIGREE NUMBER':
                return animal.pedigree;

            case 'DATE OF BIRTH':
                return animal.date_of_birth;

            case 'WORK NUMBER':
                return animal.work_number;

            case 'COLLAR NUMBER':
                return animal.collar_number;

            case 'INFLOW DATE':
                return animal.inflow_date;

            case 'GENDER':
                return animal.gender;
        }
    }

    private setOrderULN() {
        this.isASCColumnULNOrder = !this.isASCColumnULNOrder;
        this.isASCColumnOneOrder = true;
        this.isASCColumnTwoOrder = true;

        if(this.isASCColumnULNOrder) {
            this.animals = _.orderBy(this.animals, ['ulnLastFive'], ['asc']);
        } else {
            this.animals = _.orderBy(this.animals, ['ulnLastFive'], ['desc']);
        }
    }

    private setOrderColumnOne() {
        this.isASCColumnOneOrder = !this.isASCColumnOneOrder;
        this.isASCColumnULNOrder = true;
        this.isASCColumnTwoOrder = true;

        let order = 'asc';
        if(!this.isASCColumnOneOrder) {
            order= 'desc';
        }

        switch(this.selectionColumnOne) {
            case 'PEDIGREE NUMBER':
                this.animals = _.orderBy(this.animals, ['pedigree'], [order]);
                break;

            case 'DATE OF BIRTH':
                this.animals = _.orderBy(this.animals, ['date_of_birth_sort'], [order]);
                break;

            case 'WORK NUMBER':
                this.animals = _.orderBy(this.animals, ['work_number'], [order]);
                break;

            case 'COLLAR NUMBER':
                this.animals = _.orderBy(this.animals, ['collar_number'], [order]);
                break;

            case 'INFLOW DATE':
                this.animals = _.orderBy(this.animals, ['inflow_date'], [order]);
                break;

            case 'GENDER':
                this.animals = _.orderBy(this.animals, ['gender'], [order]);
                break;
        }
    }

    private setOrderColumnTwo() {
        this.isASCColumnTwoOrder = !this.isASCColumnTwoOrder;
        this.isASCColumnULNOrder = true;
        this.isASCColumnOneOrder = true;

        let order = 'asc';
        if(!this.isASCColumnTwoOrder) {
            order = 'desc';
        }

        switch(this.selectionColumnTwo) {
            case 'PEDIGREE NUMBER':
                this.animals = _.orderBy(this.animals, ['pedigree'], [order]);
                break;

            case 'DATE OF BIRTH':
                this.animals = _.orderBy(this.animals, ['date_of_birth_sort'], [order]);
                break;

            case 'WORK NUMBER':
                this.animals = _.orderBy(this.animals, ['work_number'], [order]);
                break;

            case 'COLLAR NUMBER':
                this.animals = _.orderBy(this.animals, ['collar_number'], [order]);
                break;

            case 'INFLOW DATE':
                this.animals = _.orderBy(this.animals, ['inflow_date'], [order]);
                break;

            case 'GENDER':
                this.animals = _.orderBy(this.animals, ['gender'], [order]);
                break;
        }
    }
}