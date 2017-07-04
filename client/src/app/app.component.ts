import { Component, OnInit } from '@angular/core';

import { SportService, UserService } from './shared';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
	constructor(
		private sportService: SportService,
		private userService: UserService
	) {}

	ngOnInit(): void {
		this.sportService.populate();
		this.userService.populate();
	}
}
