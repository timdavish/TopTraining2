import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { UserService } from 'app/core/services';
import { User } from 'app/shared';

@Component({
	selector: 'home-page',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnDestroy, OnInit {
	currentUser: User;

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private userService: UserService
	) {}

	ngOnInit(): void {
		this.userService.currentUser
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				userData => {
					this.currentUser = userData;
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
