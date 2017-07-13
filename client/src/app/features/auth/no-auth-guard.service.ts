import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { UserService } from 'app/core/services/user.service';

@Injectable()
export class NoAuthGuard implements CanActivate {
	constructor(
		private router: Router,
		private userService: UserService
	) {}

	public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
		return this.userService.isAuthenticated.take(1).map(isAuthenticated => {
			if (!isAuthenticated) {
				return true;
			} else {
				this.router.navigateByUrl('');
				return false;
			}
		});
	}
}
