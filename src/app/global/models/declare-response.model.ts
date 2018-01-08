export class DeclareResponseModel {
	/* currently not returned by api
		id: number;
		request_id: string;
		message_id: string;
		is_removed_by_user: string;
		action_by: User;
		 */
		message_number: string;
		log_date: string;
		error_code: string;
		error_message: string;
		error_kind_indicator: string;
		success_indicator: string;
}