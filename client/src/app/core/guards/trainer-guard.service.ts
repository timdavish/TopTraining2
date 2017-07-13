import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { UserService } from 'app/core/services/user.service';

@Injectable()
export class TrainerGuard implements CanActivate {
	constructor(
		private router: Router,
		private userService: UserService
	) {}

	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.userService.currentUsertype.take(1).map(usertype => {
			if (usertype === 'Trainer') {
				return true;
			} else {
				this.router.navigateByUrl('');
				return false;
			}
		});
	}
}
