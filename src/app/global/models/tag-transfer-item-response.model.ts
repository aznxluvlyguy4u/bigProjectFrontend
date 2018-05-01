import { User } from '../../main/client/client.model';
import { TagTransferItemRequest } from './tag-transfer-item-request.model';

export class TagTransferItemResponse {
		id: number;
		uln_country_code: string;
		uln_number: string;
		ubn_new_owner: string;
		relation_number_acceptant: string;
		animal_order_number: string;
		request_state: string;
		error_code: string;
		error_message: string;
		error_kind_indicator: string;
		success_indicator: string;
		message_number: string;
		is_removed_by_user: boolean;
		log_date: string;
		tag_transfer_item_request: TagTransferItemRequest;
		action_by: User;
}