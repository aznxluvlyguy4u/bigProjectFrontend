import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GhostLoginDetails, GhostLoginDetailsWithUbn } from '../../../main/client/client.model';
import { TranslatePipe } from 'ng2-translate';

@Component({
	selector: 'app-ghostlogin-modal',
	template: require('./ghostlogin-modal.component.html'),
	pipes: [TranslatePipe]
})
export class GhostLoginModalComponent {
		@Input() userModalDisplay: string = 'none';
		@Input() ghostLoginDetails: GhostLoginDetails|GhostLoginDetailsWithUbn = new GhostLoginDetails(); // should have at least one owner

		@Output() click = new EventEmitter();

		openUserModal() {
				this.userModalDisplay = 'block';
		}

		closeUserModal() {
				this.userModalDisplay = 'none';
		}


		loginAsGhost(personID: string) {
				window.open(window.location.origin + '/ghostlogin/' + personID);
		};
}
