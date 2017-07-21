import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AdminService } from './admin.service';
import { TrainerProfile, User } from 'app/shared/models';
import { UserService } from 'app/core/services';

@Component({
	selector: 'approve-button',
	templateUrl: './approve-button.component.html'
})
export class ApproveButtonComponent {
	isSubmitting: boolean = false;

	constructor(
		private adminService: AdminService,
		private userService: UserService
	) {}

	@Input() profile: TrainerProfile;
	@Output() onToggle = new EventEmitter<boolean>();

	toggleFollowing() {
		this.isSubmitting = true;

		this.userService.isAuthenticated.subscribe(authenticated => {
			if (authenticated) {
				// Approve this profile if it isn't already
				if (!this.profile.approved) {
					this.adminService.approve(this.profile.id)
						.subscribe(
							data => {
								this.isSubmitting = false;
								this.onToggle.emit(true);
							},
							err => this.isSubmitting = false
						);

				// Otherwise, unapprove this profile
				} else {
					this.adminService.unapprove(this.profile.id)
						.subscribe(
							data => {
								this.isSubmitting = false;
								this.onToggle.emit(false);
							},
							err => this.isSubmitting = false
						);
				}
			}
		});
	}
}
