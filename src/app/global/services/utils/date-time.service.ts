import { Injectable } from '@angular/core';

@Injectable()
export class DateTimeService {

	getDateString(dateTime: Date): string {
		const month = this.leftPadMonthOrDays(dateTime.getMonth() + 1);
		const days = this.leftPadMonthOrDays(dateTime.getDate());
		return dateTime.getFullYear() + '-' + month + '-' + days;
	}

	private leftPadMonthOrDays(string: string) {
			return ('00'+string).slice(-2);
	}
}