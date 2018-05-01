import { User } from '../../main/client/client.model';
import { TagTransferItemResponse } from './tag-transfer-item-response.model';

export class TagTransferItemRequest {
		id: number;
		request_id: string;
		message_id: string;
		uln_country_code: string;
		uln_number: string;
		animal_type: number;
		ubn_new_owner: string;
		relation_number_acceptant: string;
		request_state: string;
		log_date: string;
		// tag: Tag;
		responses: TagTransferItemResponse[] = [];
		action_by: User;
}