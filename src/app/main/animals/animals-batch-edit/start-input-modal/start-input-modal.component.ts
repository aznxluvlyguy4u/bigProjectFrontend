import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { GetAnimalsBody } from '../get-animals-body.model';
import { LocationStorage } from '../../../../global/services/storage/LocationStorage';
import { Location } from '../../../client/client.model';
import { UbnDropdownComponent } from '../../../../global/components/ubndropdown/ubn-dropdown.component';

@Component({
	selector: 'app-start-input-modal',
	template: require('./start-input-modal.component.html'),
	directives: [UbnDropdownComponent],
	pipes: [TranslatePipe]
})
export class StartInputModalComponent {
	@Input() displayModal: string = 'none';
	@Input() separator = ',';

	@Output() inputDataRequested = new EventEmitter<GetAnimalsBody>();
	@Output() closedModal = new EventEmitter();

	plainTextInputString: string = '';
	isProcessing = false;
	selectedLocation = null;

	constructor(private locationStorage: LocationStorage) {
		//TODO remove later
		this.plainTextInputString = ' NL 00189-75741   , NL 100126232800   , NL 109992775741 , NL 109993894618, UK 9JK3843, NL DDD33-25466DD , NL 100020389194, NL 03215-07224 ,    NL 00189-4FDSF';
	}

	openModal() {
			this.displayModal = 'block';
			this.selectedLocation = null;
	}

	closeModal() {
			this.displayModal = 'none';
			this.closedModal.emit(true);
	}

	sentInputData() {
			let getAnimalsBody = new GetAnimalsBody();
			getAnimalsBody.plain_text_input = this.plainTextInputString;
			getAnimalsBody.separator = this.separator;

			if (this.selectedLocation && this.selectedLocation.ubn != null) {
					getAnimalsBody.ubns = [this.selectedLocation.ubn];
			} else {
					getAnimalsBody.ubns = [];
			}

			this.inputDataRequested.emit(getAnimalsBody);
			this.closedModal.emit(true);
	};
}
