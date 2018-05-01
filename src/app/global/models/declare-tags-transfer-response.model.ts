import { DeclareResponseModel } from './declare-response.model';
import { DeclareTagTransfer } from './declare-tag-transfer.model';

export class DeclareTagsTransferResponse extends DeclareResponseModel {
		declare_tags_transfer_request_message: DeclareTagTransfer;
}