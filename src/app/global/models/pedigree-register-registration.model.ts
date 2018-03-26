import { Location } from '../../main/client/client.model';
import { PedigreeRegister } from './pedigree-register.model';

export class PedigreeRegisterRegistration {
	id: number;
	breeder_number: string;
	location: Location;
	pedigree_register: PedigreeRegister;
}