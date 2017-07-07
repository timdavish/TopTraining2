import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { UserService } from '../shared';

@Component({
	selector: 'apply-page',
	templateUrl: './apply.component.html',
	styleUrls: ['./apply.component.css']
})
export class ApplyComponent implements OnDestroy {
	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private router: Router,
		private userService: UserService
	) {}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	public cancelForm(): void {
		const user = this.userService.getCurrentUser();
		this.userService.delete(user)
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				data => {
					this.userService.purgeAuth();
					this.router.navigateByUrl('/register');
				},
				err => {}
			);
	}
}
