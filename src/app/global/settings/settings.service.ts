import {Injectable} from "@angular/core";

@Injectable()
export class SettingsService {
    private language: string = 'nl-NL';
    private locale: string = 'nl';

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
}