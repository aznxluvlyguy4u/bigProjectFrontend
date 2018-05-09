import { Component } from '@angular/core';
import { _SCRAPIE } from '../../../../global/constants/illness-type.constant';
import { IllnessBaseComponent } from '../../illnessbasecomponent/illness-base.component';

@Component({
	selector: 'app-scrapie',
	template: require('./scrapie.component.html'),
	directives: [IllnessBaseComponent]
})
export class ScrapieComponent {
	illnessType = _SCRAPIE;
}