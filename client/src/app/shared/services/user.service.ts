import { Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User, Admin, Client, Trainer } from '../models';

@Injectable()
export class UserService implements OnDestroy {
	private ngUnsubscribe: Subject<void> = new Subject<void>();

	private currentUserSubject = new BehaviorSubject<User|Admin|Client|Trainer>(new User());
	public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

	private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
	public isAuthenticated = this.isAuthenticatedSubject.asObservable();

	constructor(
		private apiService: ApiService,
		private jwtService: JwtService
	) {}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	// Verify JWT in localstorage with server & load user's info.
	// This runs once on application startup.
	public populate(): void {
		// If JWT detected, attempt to get & store user's info
		if (this.jwtService.getToken()) {
			this.apiService.get('/user')
				.takeUntil(this.ngUnsubscribe)
				.subscribe(
					data => {
						this.setAuth(data.user);
					},
					err => {
						this.purgeAuth();
					}
				)
		// Else, remove any potential remnants of previous auth states
		} else {
			this.purgeAuth();
		}
	}

	public setAuth(user: User|Admin|Client|Trainer): void {
		// Save JWT sent from server in localstorage
		this.jwtService.saveToken(user.token);
		// Set current user data into observable
		this.currentUserSubject.next(user);
		// Set isAuthenticated to true
		this.isAuthenticatedSubject.next(true);
	}

	public purgeAuth(): void {
		// Remove JWT from localstorage
		this.jwtService.destroyToken();
		// Set current user to an empty object
		this.currentUserSubject.next(new User());
		// Set auth status to false
		this.isAuthenticatedSubject.next(false);
	}

	public attemptAuth(type: string, credentials: any): Observable<User|Admin|Client|Trainer> {
		const route = (type === 'login') ? '/login' : '';
		return this.apiService.post('/users' + route, { user: credentials })
			.map(data => {
				this.setAuth(data.user);
				return data;
			});
	}

	public getCurrentUser(): User|Admin|Client|Trainer {
		return this.currentUserSubject.value;
	}

	public update(user: any): Observable<User|Admin|Client|Trainer> {
		return this.apiService
			.put('/user', { user })
			.map(data => {
				this.currentUserSubject.next(data.user);
				return data.user;
			});
	}
}
