import { Component } from '@angular/core';

import { Errors, UserService } from '../shared';

@Component({
	selector: 'trainer-app',
	templateUrl: 'trainer-app.component.html'
})
export class TrainerAppComponent {
	errors: Errors = new Errors();

	constructor(
		private userService: UserService
	) {}
}
