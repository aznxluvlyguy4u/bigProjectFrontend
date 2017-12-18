import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../main/client/client.model';
import { UtilsService } from '../services/utils/utils.service';

@Pipe({name: 'ucFirstPipe'})

export class UcFirstPipe implements PipeTransform {
	transform(value, term) {
		return value.charAt(0).toUpperCase() + value.slice(1);
	}
}