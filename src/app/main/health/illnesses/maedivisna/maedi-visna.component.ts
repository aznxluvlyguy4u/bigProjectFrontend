import { Component } from '@angular/core';
import { _MAEDI_VISNA } from '../../../../global/constants/illness-type.constant';
import { IllnessBaseComponent } from '../../illnessbasecomponent/illness-base.component';

@Component({
	selector: 'app-maedi-visna',
	template: require('./maedi-visna.component.html'),
	directives: [IllnessBaseComponent]
})
export class MaediVisnaComponent {
	illnessType = _MAEDI_VISNA;
}