import {Pipe, PipeTransform} from "@angular/core";
import { DateTimeService, YYYY_MM_DD_format } from '../../../global/services/utils/date-time.service';
import moment = require('moment');

@Pipe({
    name: 'errorLogFilter'
})
export class ErrorLogFilterPipe implements PipeTransform {

    transform(list: any, args: any[]): any {

        let searchInput: string = args[0];
        let logDateStart: string = args[1];
        let logDateEnd: string = args[2];
        let eventDateStart: string = args[3];
        let eventDateEnd: string = args[4];
        let isHiddenForAdmin: boolean = this.getBoolVal(args[5]);
        let ubn: string = args[6];
        let relatedUbn: string = args[7];
        let dutchDeclareType: string = args[8];
        let userActionType: string = args[9];
        let isHiddenForUser: boolean = this.getBoolVal(args[10]);

        let filtered = list;

				// FILTER: SEARCH
				if (searchInput != '' && searchInput != null) {
						const needle = searchInput.toLowerCase();

						filtered = filtered.filter(errorMessage => {

							let action_by = null;
							if (errorMessage.action_by) {
								if (typeof errorMessage.action_by === 'string') {
									action_by = errorMessage.action_by.toLowerCase();
								}
							}

							let description = null;
							if (typeof errorMessage.declare_info === 'string') {
								description = errorMessage.declare_info.toLowerCase();
							}

							const haystack =
								action_by +
								description
							;

							if (typeof haystack === 'string') {
									return haystack.indexOf(needle) !== -1;
							}
							return false;
						});
				}

        // FILTER: LOG START DATE
				if (DateTimeService.hasYYYYMMDDFormat(logDateStart)) {
						filtered = filtered.filter(errorMessage => {
								const errorLogStartDate = moment(errorMessage.log_date, YYYY_MM_DD_format);
								if (errorLogStartDate.isValid()) {
										return errorLogStartDate >= moment(logDateStart);
								}
								return true;
						});
				}

				// FILTER: LOG END DATE
				if (DateTimeService.hasYYYYMMDDFormat(logDateEnd)) {
						filtered = filtered.filter(errorMessage => {
							const errorLogStartEnd = moment(errorMessage.log_date, YYYY_MM_DD_format);
								if (errorLogStartEnd.isValid()) {
										return errorLogStartEnd <= moment(logDateEnd);
								}
								return true;
						});
				}

				// FILTER: DECLARE START DATE
				if (DateTimeService.hasYYYYMMDDFormat(eventDateStart)) {
						filtered = filtered.filter(errorMessage => {
								const errorEventDateStart = moment(errorMessage.event_date, YYYY_MM_DD_format);
								if (errorEventDateStart.isValid()) {
										return errorEventDateStart >= moment(eventDateStart);
								}
								return true;
						});
				}

				// FILTER: DECLARE END DATE
				if (DateTimeService.hasYYYYMMDDFormat(eventDateEnd)) {
						filtered = filtered.filter(errorMessage => {
								const errorEventDateEnd = moment(errorMessage.event_date, YYYY_MM_DD_format);
								if (errorEventDateEnd.isValid()) {
										return errorEventDateEnd <= moment(eventDateEnd);
								}
								return true;
						});
				}

        // FILTER IS HIDDEN FOR ADMIN
				if (typeof isHiddenForAdmin === 'boolean') {
						filtered = filtered.filter(errorMessage => {
								return errorMessage.hide_for_admin === isHiddenForAdmin;
						});
				}

				// FILTER IS HIDDEN FOR USER
				if (typeof isHiddenForUser === 'boolean') {
						filtered = filtered.filter(errorMessage => {
								return errorMessage.hide_failed_message === isHiddenForUser;
						});
				}

				// FILTER: USER ACTION TYPE
				if (userActionType !== 'ALL' && userActionType != null) {
						userActionType = userActionType.toLowerCase();
						filtered = filtered.filter(errorMessage => {
							return errorMessage.action_by_type.toLowerCase() === userActionType;
						});
				}

				// FILTER: UBN
				if (ubn != '' && ubn != null) {
						const needle = ubn.toLowerCase();

						filtered = filtered.filter(errorMessage => {

								if (errorMessage.ubn != null) {
										const haystack = errorMessage.ubn.toLowerCase();
										return haystack.indexOf(needle) !== -1;
								}
								return false;
						});
				}

				// FILTER: RELATED UBN
				if (relatedUbn != '' && relatedUbn != null) {
						const needle = relatedUbn.toLowerCase();

						filtered = filtered.filter(errorMessage => {

								if (errorMessage.related_ubn != null) {
										const haystack = errorMessage.related_ubn.toLowerCase();
										return haystack.indexOf(needle) !== -1;
								}
								return false;
						});
				}

				// FILTER: DUTCH DECLARE TYPE
				if (dutchDeclareType !== 'ALL' && dutchDeclareType != null && dutchDeclareType != '' && dutchDeclareType !== 'null') {
						const needle = dutchDeclareType.toLowerCase();

						filtered = filtered.filter(errorMessage => {

								if (errorMessage.dutch_type != null) {
										const haystack = errorMessage.dutch_type.toLowerCase();
										return haystack.indexOf(needle) !== -1;
								}
								return false;
						});
				}


			return filtered
    }


    private getBoolVal(string: string): any {
    	switch (string) {
				case 'true': return true;
				case 'false': return false;
				default: return string;
			}
		}
}
