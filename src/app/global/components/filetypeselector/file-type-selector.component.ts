import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-file-type-selector',
	template: require('./file-type-selector.component.html')
})
export class FileTypeSelectorComponent {
	@Input() fileTypes: string[] = [];
	@Input() selectedFileType: string;
	@Output() selectedFileTypeEvent = new EventEmitter<string>();

	onClickyClick() {
		this.selectedFileTypeEvent.emit(this.selectedFileType);
	}
}