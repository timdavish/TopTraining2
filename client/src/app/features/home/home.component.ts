import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SportService } from 'app/core/services/sport.service';
import { UserService } from 'app/core/services/user.service';
import { Sport, User } from 'app/shared';

@Component({
	selector: 'home-page',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy, OnInit {
	buttonView: string = '';
	currentUser: User = new User();
	sports: Sport[] = [];

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private sportService: SportService,
		private userService: UserService
	) {}

	ngOnInit(): void {
		// Populate user
		this.userService.currentUser
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				userData => {
					this.currentUser = userData;
				},
				err => {}
			);
		// Populate sports
		this.sportService.getSports()
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				sports => {
					this.sports = sports;
				},
				err => {}
			);
	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
