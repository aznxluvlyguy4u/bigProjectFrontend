import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'editable-component',
    template: require('./editable.component.html')
})
export class EditableComponent implements OnInit {

    private editableVal:string;
    private editMode:boolean = false;

    @Output() editableValueChange = new EventEmitter();

    @Input()
    get editableValue() {
        return this.editableVal;
    }
    set editableValue(val) {
        this.editableVal = val;
        this.editableValueChange.emit(this.editableVal);
    }

    constructor() {}

    ngOnInit() { }

    enableEditMode(){
        this.editMode = true;
        //this.editableValueChange.emit(this.editableValue);
    }

    disableEditMode(){
        this.editMode = false;
        //this.editableValueChange.emit(this.editableValue);
    }
}