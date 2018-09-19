import moment = require('moment');
import {Injectable} from "@angular/core";

@Injectable()
export class SettingsService {
    private language: string = 'nl-NL';
    private locale: string = 'nl';
    private viewDateFormat: string = 'DD-MM-YYYY';
    private viewDateTimeFormat: string = 'DD-MM-YYYY HH:mm';
    private modelDateTimeFormat: string = 'YYYY-MM-DDThh:mm:ssZ';
    private modelDateFormat: string = 'YYYY-MM-DD';

    private ENV: string = ENVIRONMENT;

    // Feature activation
    public static isInvoicesActive = false;

    public isDevEnv() {
        return this.ENV === 'LOCAL';
    }

    public setLanguage(language: string) {
        this.language = language;
    }

    public getLanguage() {
        return this.language;
    }

    public setLocale(locale: string) {
        this.locale = locale;
    }

    public getLocale() {
        return this.locale;
    }

    public static getDateString_YYYY_MM_DD_fromDate(date: Date = new Date()) {
			return date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate();
    }

    public getViewDateFormat() {
        return this.viewDateFormat;
    }

    public setViewDateFormat(viewDateFormat) {
        this.viewDateFormat = viewDateFormat;
    }

    public convertToViewDate(date) {
        return moment(date).format(this.getViewDateFormat())
    }

    public getViewDateTimeFormat() {
        return this.viewDateTimeFormat;
    }

    public setViewDateTimeFormat(viewDateTimeFormat) {
        this.viewDateTimeFormat = viewDateTimeFormat;
    }

    public convertToViewDateTime(date) {
        return moment(date).format(this.getViewDateTimeFormat())
    }

    public getModelDateTimeFormat() {
        return this.modelDateTimeFormat;
    }

    public setModelDateTimeFormat(modelDateTimeFormat) {
        this.modelDateTimeFormat = modelDateTimeFormat;
    }

    public convertToModelDateTime(date) {
        return moment(date).format(this.getModelDateTimeFormat())
    }

    getVatPercentages(): number[] {
        return [
          0,
          6,
          12,
          21
        ];
    }
}