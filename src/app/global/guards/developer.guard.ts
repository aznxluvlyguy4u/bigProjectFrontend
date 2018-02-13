import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import { UtilsService } from '../services/utils/utils.service';

@Injectable()
export class DeveloperGuard implements CanActivate {

	constructor(private router: Router, private utils: UtilsService) {}

	canActivate() {
		if (!!localStorage.getItem('access_token') && this.utils.isDeveloper) {
			return true;
		}

		this.router.navigate(['/login']);
		return false;
	}
}