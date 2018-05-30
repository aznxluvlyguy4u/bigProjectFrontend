import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {CheckMarkComponent} from "../checkmark/check-mark.component";
import {TranslatePipe} from "ng2-translate";
@Component({
    selector: 'confirmation-modal',
    template: require('./confirmationComponent.html'),
    directives: [CheckMarkComponent],
    pipes: [TranslatePipe]
})

export class ConfirmationComponent implements OnInit {

    @Input() buttonText: string;
    @Input() modalDetailText: string;
    @Input() checkBoxText: string;
    @Input() confirmButtonText: string;
    @Output() result =  new EventEmitter();

    private displayModal: string = 'none';
    private additionalCheck: boolean = false;

    ngOnInit() {

    }

    openModal() {
        this.displayModal = "block";
    }

    closeModal() {
        this.displayModal = "none";
    }

    sendConfirmation() {
        this.result.emit(true);
    }
}
