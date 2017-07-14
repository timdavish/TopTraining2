import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';

import { ApiService } from './api.service';
import { Sport } from 'app/shared/models';

@Injectable()
export class SportService implements OnDestroy {
	private readonly sportsSubject = new BehaviorSubject<Sport[]>([]);

	public sports = this.sportsSubject.asObservable().distinctUntilChanged();

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private apiService: ApiService
	) {}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	// Load sports
	// This runs once on application startup.
	public populate(): void {
		this.apiService.get('/sports')
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				data => {
					this.setSports(data.sports);
				},
				err => { console.log('Failed to retrieve sports'); }
			);
	}

	public setSports(sports: Array<Sport>): void {
		// Set current user data into observable
		this.sportsSubject.next(sports);
	}

	public getSports(): Observable<Array<Sport>> {
		return this.sports;
	}

	public create(sport: any): Observable<Sport> {
		return this.apiService.post('/sports', { sport: sport })
			.map(data => {
				let sports = this.sportsSubject.value;
				sports.push(data.sport);

				this.setSports(sports);
				return data;
			});
	}

	public delete(sport: any): Observable<Sport> {
		return this.apiService.delete('/sports/' + sport.id);
	}
}
