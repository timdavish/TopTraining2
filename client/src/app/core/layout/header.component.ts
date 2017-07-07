import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { UserService } from 'app/core/services/user.service';
import { User } from 'app/shared/models';

@Component({
	selector: 'layout-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnDestroy, OnInit {
	currentUser: User;

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
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

	public logout(): void {
		this.userService.purgeAuth();
		this.router.navigateByUrl('/');
	}
}
