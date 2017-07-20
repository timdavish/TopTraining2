import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { Application } from './application.model';
import { LocalStorageService, UserService } from 'app/core/services';
import { TrainerProfile, User } from 'app/shared';

@Injectable()
export class ApplicationService implements OnDestroy {
	currentUser: User;
	application: any = {};

	private ngUnsubscribe: Subject<void> = new Subject<void>();
	private prefix: string = 'id';
	private key: string = 'application';

	constructor(
		private localStorageService: LocalStorageService,
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
				},
				err => {}
			);
	}

	public submitApplication(application: Application) {
		const user = this.currentUser;
		const profile = this.convertApplicationToProfile(application);

		user.profiles.push(profile);

		return this.userService.update(user)
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				updatedUser => {
					this.localStorageService.remove(this.deriveKey());
				},
				err => { console.log(err); }
			);
	}

	public updateApplication(applicationSegment: Application): boolean {
		for (let attr in applicationSegment) {
			this.application[attr] = applicationSegment[attr];
		}
		return this.localStorageService.set(this.deriveKey(), this.application);
	}

	public retrieveApplication(): Application {
		return this.localStorageService.get <Application>(this.deriveKey());
	}

	private convertApplicationToProfile(app: Application): TrainerProfile {
		return {
			sport: app.sport,
			completed: true,
			approved: false,
			image: 'Image',
			locations: app.locations,
			packages: this.createPackages(app),
			summary: app.summary,
			credentials: {
				experience: app.experience,
				school: app.school,
			},
			services: {
				ages: [
					{ name: 'Adults', selected: app.ages_adults },
					{ name: 'Kids', selected: app.ages_kids },
					{ name: 'Teenagers', selected: app.ages_teenagers }
				],
				positions: app.positions,
				specialties: app.specialties,
			}
		};
	}

	private createPackages(app: Application): any {
		let packages = [];

		if (app.session_length != null && app.session_rate != null && app.session_type_private != null && app.session_type_small != null && app.session_type_large != null) {
			let types = {
				private: app.session_type_private,
				small: app.session_type_small,
				large: app.session_type_large
			};
			for (let type in types) {
				if (types[type]) {
					const counts = [1, 2, 5, 10];
					for (let count of counts) {
						var next = {
							type: type,
							sessions: count,
							price: app.session_rate * count
						};
						packages.push(next);
					}
				}
			}
		}

		return packages;
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
