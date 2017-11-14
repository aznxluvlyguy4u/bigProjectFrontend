import { Control, ControlGroup } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class FormUtilService {

		addSubErrorsToForm(dateForm: ControlGroup, controlKey: string, error: any): ControlGroup {
				const currentErrors = dateForm.controls[controlKey].errors;
				const newErrors = this.mergeErrors(currentErrors, error);

				(<Control>dateForm.controls[controlKey]).setErrors(newErrors);
				return dateForm;
		}

		addTotalErrorsToForm(dateForm: ControlGroup, error: any): ControlGroup {
				const currentErrors = dateForm.errors;
				const newErrors = this.mergeErrors(currentErrors, error);

				(<ControlGroup>dateForm).setErrors(newErrors);
				return dateForm;
		}

	/**
	 * !Note merging of errors will always correctly output not-null, but the format is still inconsistent.
	 * Only use this to check for if there are any errors or not.
	 *
	 * @param currentErrors
	 * @param newErrorToAdd
	 * @returns {any}
	 */
		mergeErrors(currentErrors, newErrorToAdd) {
				if (newErrorToAdd == null) { return currentErrors; }

				let newErrors: [any];
				if (currentErrors == null) {
						newErrors = [newErrorToAdd];
				} else {

						if (currentErrors instanceof Array) {
								newErrors = currentErrors.push(newErrorToAdd);
						} else {
								newErrors = [
										currentErrors,
										newErrorToAdd
								];
						}
				}
				return newErrors;
		}


		getBoolDrowDownText(string: string|boolean): string {
				if (string === 'true' || string === true) {
						return 'TRUE';
				}

				if (string === 'false' || string === false) {
						return 'FALSE';
				}

				return 'ALL';
		}
}