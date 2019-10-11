import {Component, EventEmitter} from '@angular/core';
import { TranslatePipe } from 'ng2-translate';
import { POPREP_INPUT_FILE } from '../../../../global/constants/report-type.constant';
import { DownloadService } from '../../../../global/services/download/download.service';
import {PedigreeRegisterDropdownComponent} from "../../../../global/components/pedigreeregisterdropdown/pedigree-register-dropdown.component";
import {PedigreeRegister} from "../../../../global/models/pedigree-register.model";

@Component({
	selector: 'app-poprep-input-file',
	template: require('./poprep-input-file.component.html'),
	directives: [PedigreeRegisterDropdownComponent],
	pipes: [TranslatePipe]
})
export class PoprepInputFileComponent {
	title = POPREP_INPUT_FILE;

	pedigreeRegister: PedigreeRegister;
	initialValuesChanged = new EventEmitter<boolean>();

	constructor(private downloadService: DownloadService) {}

	ngOnInit() {
		this.pedigreeRegister = null;
	}

	notifyInputValues() {
		this.initialValuesChanged.emit(true);
	}

	download() {
		this.notifyInputValues();
		this.downloadService.doPopRepInputFileReportGetRequest((this.pedigreeRegister != null ? this.pedigreeRegister.abbreviation : null));
	}
}
