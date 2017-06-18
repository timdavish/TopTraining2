import { Component, Input } from '@angular/core';

import { Errors } from '../models';

@Component({
	selector: 'list-errors',
	templateUrl: './list-errors.component.html'
})
export class ListErrorsComponent {
	formattedErrors: Array<string> = [];

	@Input() private set errors(errorList:Errors) {
		this.formattedErrors = [];

		if (errorList.errors) {
			for (const field in errorList.errors) {
				this.formattedErrors.push(`${field} ${errorList.errors[field]}`);
			}
		}
	}

	public get errorList(): Array<string> {
		return this.formattedErrors;
	}
}
