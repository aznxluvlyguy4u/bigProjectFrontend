import {Component, Input} from "@angular/core";
import {CheckMarkComponent} from "../checkmark/check-mark.component";
import {TranslatePipe} from "ng2-translate";
@Component({
    selector: 'feedback-component',
    template: require('./feedback-component.html'),
    directives: [CheckMarkComponent],
    pipes: [TranslatePipe]
})

export class FeedbackComponent {

    @Input() messageText: string;
    @Input() showSpinners: boolean;
}
