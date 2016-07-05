import moment from 'moment';
import {Injectable} from "@angular/core";

@Injectable()
export class SettingsService {
    private language: string = 'nl-NL';
    private locale: string = 'nl';
    private viewDateFormat: string = 'DD-MM-YYYY';
    private viewDateTimeFormat: string = 'DD-MM-YYYY HH:mm';
    private modelDateTimeFormat: string = 'YYYY-MM-DDThh:mm:ssZ';

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
}