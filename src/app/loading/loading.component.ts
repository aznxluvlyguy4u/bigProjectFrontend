import {Component} from "@angular/core";
import {TranslatePipe} from "ng2-translate/ng2-translate";

@Component({
    template: require('./loading.component.html'),
    pipes: [TranslatePipe]
})

export class LoadingComponent{}