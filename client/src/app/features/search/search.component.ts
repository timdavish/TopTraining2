import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { SearchService } from './shared/search.service';
import { SearchFilters, searchFiltersState, SearchQuery, searchQueryState, TrainerProfile } from 'app/shared/models';

@Component({
	selector: 'search',
	templateUrl: './search.component.html'
})
export class SearchComponent implements OnDestroy, OnInit {
	isLoading: boolean = false;
	filters: SearchFilters = searchFiltersState;
	query: SearchQuery = new SearchQuery();
	profiles: TrainerProfile[] = [];
	profileCount: number = 0;
	showForm: boolean = false;

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private searchService: SearchService
	) {}

	ngOnInit(): void {
		// Subscribe to query params
		this.activatedRoute.queryParams
			.flatMap(params => {
				this.isLoading = true;
				if (this.isSufficient(params as SearchQuery)) {
					this.query = params as SearchQuery;
					return this.searchService.search(this.query);
				} else {}
			})
			.takeUntil(this.ngUnsubscribe)
			.subscribe(data => {
				this.profiles = data.profiles;
				this.profileCount = data.profiles.length;
				this.isLoading = false;
			}, err => {
				this.isLoading = false;
			});
	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	switchFormStatus(status: boolean) {
		this.showForm = status;
	}
	private isSufficient(query: SearchQuery): boolean {
		return !!query.sport && !!query.location && !!query.lat && !!query.long;
	}
}
