import { Component, OnInit } from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from "@angular/router";
import {TranslatePipe} from "ng2-translate/ng2-translate";
import { _MAEDI_VISNA, _SCRAPIE } from '../../global/constants/illness-type.constant';
import { IllnessBaseComponent } from './illnessbasecomponent/illness-base.component';

@Component({
    directives: [ROUTER_DIRECTIVES],
    template: require('./health.component.html'),
    pipes: [TranslatePipe]
})

export class HealthComponent implements OnInit {

    selectedIllness: string = _MAEDI_VISNA;
    latestSelectedIllness: string;

    constructor(private router: Router) {}

    private navigateTo(url: string) {
        this.router.navigate([url]);
    }

    ngOnInit() {
    	this.latestSelectedIllness = this.selectedIllness;
		}

    getIllnesses(): string[] {
			return [
				_MAEDI_VISNA,
				_SCRAPIE,
				// _CAE,
				// _CL,
				// _ROT
			];
    }

		goToSelectedIllness() {
    	if (this.selectedIllness !== this.latestSelectedIllness) {
				console.log(this.selectedIllness, IllnessBaseComponent.getInspectionsPathByIllnessType(this.selectedIllness));
				this.latestSelectedIllness = this.selectedIllness;
				this.navigateTo(IllnessBaseComponent.getInspectionsPathByIllnessType(this.selectedIllness));
			}
		}
}