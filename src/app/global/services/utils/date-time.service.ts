import { Injectable } from '@angular/core';
import moment = require('moment');

export const SECONDS_PER_DAY = 86400000;
export const YYYY_MM_DD_format = 'YYYY-MM-DD';

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

	getDateIntervalInDays(startDate: Date, endDate: Date): number {
		const intervalMilSec = (endDate.valueOf() - startDate.valueOf());
		return intervalMilSec/SECONDS_PER_DAY;
	}

	getDateStringIntervalInDays(startDateString: string, endDateString: string): number {
			return this.getDateIntervalInDays(
				new Date(startDateString).valueOf(),
				new Date(endDateString).valueOf()
			);
	}

	getApproxDateStringIntervalInMonths(startDateString: string, endDateString: string): number {
			const intervalDays = this.getDateStringIntervalInDays(startDateString, endDateString);
			if (intervalDays === 0) {
				return 0;
			}
			return (intervalDays / 366) * 12;
	}

	static hasYYYYMMDDFormat(dateString: string): boolean {
			return moment(dateString, YYYY_MM_DD_format, true).isValid();
	}
}