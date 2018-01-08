import { User } from '../../main/client/client.model';
import { DeclareNsfoBase } from './declare-nsfo-base.model';

export class DeclareBase {
		/* currently not returned by api
		request_id: string;
		action: string;
		recovery_indicator: string;
		*/
		id: number;
		log_date: string;
		message_id: string;
		request_state: string;
		relation_number_keeper: string;
		ubn: string;
		message_number_to_recover: string;
		action_by: User;
		hide_failed_message: boolean;
		hide_for_admin: boolean;
		newest_version: DeclareBase;
		type: string;
}