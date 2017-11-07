import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
    name: 'logFilter'
})

export class LogFilterPipe implements PipeTransform {

    transform(list: any, args: any[]): any {

        let search_input: string = args[0];
        let is_completed_option: boolean = args[1];
        let is_user_environment_option: boolean = args[2];
        let is_vwa_environment_option: boolean = args[3];
        let is_rvo_message_option: boolean = args[4];
        let user_action_type_options: string = args[5];

        let filtered = list;

				// FILTER: SEARCH
				if (search_input) {
						const needle = args[0].toLowerCase();

						filtered = filtered.filter(actionLog => {

							let account_first_name = false;
							let account_last_name = false;
							if (actionLog.user_account) {
								if (typeof actionLog.user_account.first_name === 'string') {
									account_first_name = actionLog.user_account.first_name.toLowerCase();
								}
								if (typeof actionLog.user_account.last_name === 'string') {
									account_last_name = actionLog.user_account.last_name.toLowerCase();
								}
							}

							let action_by_first_name = null;
							let action_by_last_name = null;
							if (actionLog.action_by) {
								if (typeof actionLog.action_by.first_name === 'string') {
									action_by_first_name = actionLog.action_by.first_name.toLowerCase();
								}
								if (typeof actionLog.action_by.last_name === 'string') {
									action_by_last_name = actionLog.action_by.last_name.toLowerCase();
								}
							}

							let description = null;
							if (typeof actionLog.description === 'string') {
								description = actionLog.description.toLowerCase();
							}

							const haystack = account_first_name +
								account_last_name +
								action_by_first_name +
								action_by_last_name +
								description
							;

							return haystack.indexOf(needle) !== -1;
						});
				}

        // FILTER: IS COMPLETED
				if (typeof is_completed_option === 'boolean') {
						filtered = filtered.filter(actionLog => {
								return actionLog.is_completed === is_completed_option;
						});
				}

        // FILTER: IS USER ENVIRONMENT
				if (typeof is_user_environment_option === 'boolean') {
						filtered = filtered.filter(actionLog => {
								return actionLog.is_user_environment === is_user_environment_option;
						});
				}

        // FILTER IS VWA ENVIRONMENT
				if (typeof is_vwa_environment_option === 'boolean') {
						filtered = filtered.filter(actionLog => {
								return actionLog.is_vwa_environment === is_vwa_environment_option;
						});
				}

        // FILTER IS RVO MESSAGE
				if (typeof is_rvo_message_option === 'boolean') {
						filtered = filtered.filter(actionLog => {
								return actionLog.is_rvo_message === is_rvo_message_option;
						});
				}

				// FILTER: USER ACTION TYPE
				if (user_action_type_options !== 'ALL' && user_action_type_options !== null) {
						user_action_type_options = user_action_type_options.toLowerCase();
						filtered = filtered.filter(actionLog => {
							return actionLog.user_action_type.toLowerCase().indexOf(user_action_type_options) !== -1;
						});
				}

        return filtered
    }
}
