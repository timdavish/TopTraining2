import { Component, OnInit } from '@angular/core';

import { SportService } from './core/services/sport.service';
import { UserService } from './core/services/user.service';

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
