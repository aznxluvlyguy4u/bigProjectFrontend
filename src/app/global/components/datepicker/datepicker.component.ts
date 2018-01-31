import moment = require('moment');
import {Component, Input, Output, EventEmitter,ViewContainerRef} from '@angular/core';
import {Control} from '@angular/common';

@Component({
    selector: 'datepicker',
    template: require('./datepicker.component.html'),
})

export class Datepicker {
    public isOpened: boolean;
    public dateValue: string;
    public viewValue: string;
    public days: Array<Object>;
    public dayNames: Array<string>;
    private el: any;
    private date: any;
    private viewContainer: ViewContainerRef;
    private onChange: Function;
    private onTouched: Function;
    // private cd: any;
    private cannonical: number;
    today: string = moment().format('D MMM YYYY');

    @Input() modelFormat: string;
    @Input() viewFormat: string;
    @Input() initDate: string;
    @Input() editMode: boolean = true;
    @Input('first-week-day-sunday') firstWeekDaySunday: boolean;
    @Input('static') isStatic: boolean;
    @Input() formCtrl: Control;

    @Output('datePickerEvent') changed: EventEmitter<Date> = new EventEmitter<Date>();

    // constructor(cd: NgModel, viewContainer: ViewContainerRef) {
    constructor(viewContainer: ViewContainerRef) {
        // cd.valueAccessor = this;
        // this.cd = cd;
        this.viewContainer = viewContainer;
        this.el = viewContainer.element.nativeElement;
        this.init();
    }

    private generateDayNames(): void {
        this.dayNames = [];
        let date = this.firstWeekDaySunday === true ? moment('2015-06-07') : moment('2015-06-01');
        for (let i = 0; i < 7; i += 1) {
            this.dayNames.push(date.format('ddd'));
            date.add('1', 'd');
        }
    }

    private generateCalendar(date): void {
        let lastDayOfMonth = date.endOf('month').date();
        let month = date.month();
        let year = date.year();
        let n = 1;
        let firstWeekDay = null;

        this.dateValue = date.format('MMMM YYYY');
        this.days = [];

        if (this.firstWeekDaySunday === true) {
            firstWeekDay = date.set('date', 2).day();
        } else {
            firstWeekDay = date.set('date', 1).day();
        }

        if (firstWeekDay !== 1) {
            n -= firstWeekDay - 1;
        }

        // Fix: In case the first day is on a sunday
        if (!this.firstWeekDaySunday && n === 2 && firstWeekDay === 0) {
            n = -5;
            firstWeekDay = -7;
        }

        for (let i = n; i <= lastDayOfMonth; i += 1) {
            if (i > 0) {
                this.days.push({ day: i, month: month + 1, year: year, enabled: true });
            } else {
                this.days.push({ day: null, month: null, year: null, enabled: false });
            }
        }
    }

    private initMouseEvents(): void {
        let body = document.getElementsByTagName('body')[0];

        body.addEventListener('click', (e) => {
            if (!this.isOpened || !e.target) return;
            if (this.el !== e.target && !this.el.contains(e.target)) {
                this.closeDatepicker();
            }
        }, false);
    }

    ngAfterViewInit() {
        this.initValue();
    }

    public openDatepicker(): void {
        this.isOpened = true;
    }

    public closeDatepicker(): void {
        this.isOpened = false;
    }

    public prevYear(): void {
        this.date.subtract(1, 'Y');
        this.generateCalendar(this.date);
    }

    public prevMonth(): void {
        this.date.subtract(1, 'M');
        this.generateCalendar(this.date);
    }

    public nextYear(): void {
        this.date.add(1, 'Y');
        this.generateCalendar(this.date);
    }

    public nextMonth(): void {
        this.date.add(1, 'M');
        this.generateCalendar(this.date);
    }

    public selectDate(e, date): void {
        e.preventDefault();
        if (this.isSelected(date)) return;

        let selectedDate = moment(date.day + '.' + date.month + '.' + date.year, 'DD.MM.YYYY');
        this.setValue(selectedDate);
        this.closeDatepicker();
        this.changed.emit(selectedDate.toDate());
    }

    isSelected(date) {
        let selectedDate = moment(date.day + '.' + date.month + '.' + date.year, 'DD.MM.YYYY');
        return selectedDate.toDate().getTime() === this.cannonical;
    }

    private setValue(value: any): void {
        let val = moment(value, this.modelFormat || 'DD-MM-YYYY');
        this.viewValue = val.format(this.viewFormat || 'DD-MM-YYYY');
        // this.cd.viewToModelUpdate(val.format(this.modelFormat || 'YYYY-MM-DD'));
        this.cannonical = val.toDate().getTime();
        this.formCtrl.updateValue(val.format(this.modelFormat));
    }

    private initValue(): void {
        setTimeout(() => {
            if (!this.initDate) {
                this.setValue(moment().format(this.modelFormat || 'DD-MM-YYYY'));
            } else {
                this.setValue(moment(this.initDate, this.viewFormat || 'DD-MM-YYYY'));
            }
        });
    }

    writeValue(value: string): void {
        if (!value) return;
        this.setValue(value);
    }

    registerOnChange(fn: (_: any) => {}): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: (_: any) => {}): void {
        this.onTouched = fn;
    }

    private init(): void {
        this.isOpened = false;
        this.date = moment();
        this.firstWeekDaySunday = false;
        this.generateDayNames();
        this.generateCalendar(this.date);
        this.initMouseEvents();
    }

}