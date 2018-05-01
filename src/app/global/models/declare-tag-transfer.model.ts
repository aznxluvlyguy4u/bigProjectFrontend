import { DeclareBase } from './declare-base.model';
import { TagTransferItemRequest } from './tag-transfer-item-request.model';
import { DeclareTagsTransferResponse } from './declare-tags-transfer-response.model';

export class DeclareTagTransfer extends DeclareBase {
		/* not returned by api
		 tags: Tag[];
		 */
		tag_transfer_requests: TagTransferItemRequest[] = [];
		relation_number_acceptant: string;
		ubn_new_owner: string;
		location: Location;
		responses: DeclareTagsTransferResponse[] = [];
}