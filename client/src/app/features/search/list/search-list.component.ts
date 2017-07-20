import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SearchService } from '../shared/search.service';
import { Errors, SearchFilters, TrainerProfile } from 'app/shared/models';

@Component({
	selector: 'search-list',
	templateUrl: './search-list.component.html'
})
export class SearchListComponent implements OnDestroy {
	currentPage: number = 1;
	totalPages: Array<number> = [1];
	errors: Errors = new Errors();
	isLoading: boolean = false;
	searchFilters: SearchFilters;
	profiles: TrainerProfile[];

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private searchService: SearchService
	) {}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	@Input() limit: number;
	@Input() set filters(filters: SearchFilters) {
		if (filters) {
			this.searchFilters = filters;
			this.currentPage = 1;
			this.runSearch();
		}
	}

	private runSearch(): void {
		this.errors = new Errors();
		this.isLoading = true;
		this.profiles = [];

		// Set limit and offset filters
		if (this.limit) {
			this.searchFilters.limit = this.limit;
			this.searchFilters.offset = (this.limit * (this.currentPage - 1));
		}

		this.searchService.search(this.searchFilters)
			.takeUntil(this.ngUnsubscribe)
			.subscribe(data => {
				this.isLoading = false;
				this.profiles = data.trainerProfiles;
				// Used from http://www.jstips.co/en/create-range-0...n-easily-using-one-line/
				this.totalPages = Array.from(new Array(Math.ceil(data.count / this.limit)), (val, index) => index + 1);
			});
	}

	private setPage(pageNumber: number): void {
		this.currentPage = pageNumber;
		this.runSearch();
	}
}
