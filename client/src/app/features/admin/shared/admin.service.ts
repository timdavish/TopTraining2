import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiService } from 'app/core/services';
import { Sport, TrainerProfile, User } from 'app/shared/models';

@Injectable()
export class AdminService {
	admins: User[] = [];
	clients: User[] = [];
	sports: Sport[] = [];
	trainers: User[] = [];

	constructor(
		private apiService: ApiService
	) {
		this.cacheSports();
		this.cacheUsers();
	}

	addSport(sport: string): Observable<Sport> {
		return this.apiService.post('/sports', { sport: new Sport(sport, []) });
	}

	approve(userId: string, profileId: string) {
		return this.apiService.put(`/users/${userId}/approve/${profileId}/true`);
	}

	unapprove(userId: string, profileId: string) {
		return this.apiService.put(`/users/${userId}/approve/${profileId}/false`);
	}

	getSports(): Sport[] {
		return this.sports;
	}

	getAdmins(): User[] {
		return this.admins;
	}

	getClients(): User[] {
		return this.clients;
	}

	getTrainers(): User[] {
		return this.trainers;
	}

	private cacheSports(): void {
		this.apiService.get('/sports')
			.subscribe(
				data => {
					this.sports = data.sports;
				},
				err => {}
			);
	}

	private cacheUsers(): void {
		this.apiService.get('/users/all')
			.subscribe(
				data => {
					this.admins = data.users.filter((user) => { return user.usertype === 'Admin' });
					this.clients = data.users.filter((user) => { return user.usertype === 'Client' });
					this.trainers = data.users.filter((user) => { return user.usertype === 'Trainer' });
				},
				err => {}
			);
	}
}
