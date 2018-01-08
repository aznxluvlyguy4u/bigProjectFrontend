import { User } from '../../main/client/client.model';

export class DeclareNsfoBase {
		id: number;
		log_date: string;
		message_id: string;
		request_state: string;
		relation_number_keeper: string;
		ubn: string;
		action_by: User;
		revoked_by: User;
		revoke_date: string;
		is_hidden: boolean;
		hide_for_admin: boolean;
		is_overwritten_version: boolean;
		newest_version: DeclareNsfoBase;
		older_versions: DeclareNsfoBase[] = [];
		type: string;
}