import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { LocalStorageService, UserService } from 'app/core/services';
import { User, TrainerProfile } from 'app/shared';

@Injectable()
export class ApplyService implements OnDestroy {
	currentUser: User;
	profile: any = {};

	private ngUnsubscribe: Subject<void> = new Subject<void>();
	private prefix: string = 'id';
	private key: string = 'profile';

	constructor(
		private localStorageService: LocalStorageService,
		private router: Router,
		private userService: UserService
	) {
		this.currentUser = this.userService.getCurrentUser();
		this.setPrefix(this.currentUser.id);
		// TODO: retrieveProfile();
	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	public cancelApplication() {
		return this.userService.delete(this.currentUser)
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				data => {
					this.localStorageService.remove(this.deriveKey());
					this.userService.purgeAuth();
					this.router.navigateByUrl('/register');
				},
				err => {}
			);
	}

	public updateProfile(profileSegment: any): boolean {
		console.log('Updating at key', this.deriveKey());
		for (let attr in profileSegment) {
			this.profile[attr] = profileSegment[attr];
		}
		return this.localStorageService.set(this.deriveKey(), this.profile);
	}

	public retrieveProfile(): TrainerProfile {
		console.log('Retrieving at key', this.deriveKey());
		return this.localStorageService.get <TrainerProfile>(this.deriveKey());
	}

	private deriveKey(): string {
        return `${this.prefix}${this.key}`;
    }

	private setPrefix(prefix: string): void {
        this.prefix = prefix;

        // If there is a prefix set in the config let's use that with an appended
        // period for readability:
        const PERIOD: string = '.';
        if (this.prefix && !this.prefix.endsWith(PERIOD)) {
            this.prefix = !!this.prefix ? `${this.prefix}${PERIOD}` : '';
        }
    }
}
