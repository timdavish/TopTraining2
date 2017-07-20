import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { SearchFilters } from 'app/shared/models';

@Component({
	selector: 'search',
	templateUrl: './search.component.html'
})
export class SearchComponent implements OnDestroy, OnInit {
	limit: number = 10;
	filters: SearchFilters = new SearchFilters();

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router
	) {}

	ngOnInit(): void {
		this.activatedRoute.queryParams
			.takeUntil(this.ngUnsubscribe)
			.subscribe(params => {
				this.filters.sport = params['sport'];
				this.filters.location = params['location'];
				this.filters.lat = params['lat'];
				this.filters.long = params['long'];
				console.log(this.filters);
				this.filters = params;
				console.log(this.filters);
			});
	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
