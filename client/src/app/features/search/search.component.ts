import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { SearchFilters } from 'app/shared/models';

@Component({
	selector: 'search',
	templateUrl: './search.component.html'
})
export class SearchComponent implements OnDestroy, OnInit {
	limit: number = 3;
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
				if (this.isSufficient(params)) {
					for (const key in params) {
						this.filters[key] = params[key];
					}
				} else {
					this.router.navigateByUrl('');
				}
			});
	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	private isSufficient(params: Params): boolean {
		return !!params.sport && !!params.location && !!params.lat && !!params.long;
	}
}
