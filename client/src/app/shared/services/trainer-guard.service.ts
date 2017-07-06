import { Injectable, OnDestroy } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { UserService } from './user.service';

@Injectable()
export class TrainerGuard implements CanActivate, OnDestroy {
	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private userService: UserService
	) {}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	public canActivate(): boolean {
		this.userService.currentUser
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				user => {
					return user.usertype === 'trainer';
				},
				err => {
					return false;
				}
			);
		return true;
	}
}
