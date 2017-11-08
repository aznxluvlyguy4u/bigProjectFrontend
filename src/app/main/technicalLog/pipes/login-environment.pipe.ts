import {Pipe, PipeTransform} from "@angular/core";
import { ActionLog } from '../../client/client.model';
import { ADMIN, USER, VWA } from '../../../global/constants/login-environments.contant';

@Pipe({
	name: 'loginEnvironment'
})

export class LoginEnvironmentPipe implements PipeTransform {
	transform(log: ActionLog, args: any[]): string {
		if (log === null) { return ''; }

		if (log.is_user_environment) {
			return USER;
		}

		if (log.is_vwa_environment) {
			return VWA;
		}

		return ADMIN;
	}
}