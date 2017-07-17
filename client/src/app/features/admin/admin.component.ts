import { Component, OnInit } from '@angular/core';

import { AdminService } from './shared/admin.service';
import { SportService } from 'app/core/services';
import { Sport, TrainerProfile, User } from 'app/shared/models';

@Component({
	selector: 'admin',
	templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
	constructor(
		private adminService: AdminService,
		private sportService: SportService
	) {}

	ngOnInit(): void {}

	get admins(): User[] {
		return this.adminService.getAdmins();
	}

	get clients(): User[] {
		return this.adminService.getClients();
	}

	get sports(): Sport[] {
		return this.adminService.getSports();
	}

	get trainers(): User[] {
		return this.adminService.getTrainers();
	}

	numApplicationsCompleted(user: User): number {
		return user.profiles.filter((p) => p.completed).length;
	}

	onToggleApproved(profile: TrainerProfile, approved: boolean) {
		profile.approved = approved;
	}
}
