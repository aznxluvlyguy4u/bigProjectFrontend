import { HideErrorResponse } from './hide-error-response.model';

export class HideErrorsUpdateResult {
		result: {
				success_count: number;
				error_count: number;
				successful_edits: HideErrorResponse[];
		}
}