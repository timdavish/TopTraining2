import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { Pager, PagerService } from 'app/core/services'
import { SearchService } from '../shared/search.service';
import { Errors, SearchFilters, searchFiltersState, SearchQuery, TrainerProfile } from 'app/shared/models';

@Component({
	selector: 'search-list',
	templateUrl: './search-list.component.html',
	styleUrls: ['./search-list.component.css']
})
export class SearchListComponent implements OnChanges, OnInit {
	@Input() profiles: TrainerProfile[];
	@Input() count: number;
	@Input() sport: string;
	@Input() location: string;

	errors: Errors = new Errors();
	filters: SearchFilters = searchFiltersState;
	sort: string;
	limit: number = 5;
	pageSize: number = 0;
	pager: Pager = new Pager();
	get pagedProfiles() { return this._pagedProfiles; }

	private _pagedProfiles: TrainerProfile[] = [];

	constructor(
		private pagerService: PagerService,
		private route: ActivatedRoute,
		private router: Router,
		private searchService: SearchService
	) {}

	ngOnInit(): void {
		// Subscribe to route params
		this.route.queryParams.subscribe(params => {
			console.log('queryParamsChange', params);
			Object.assign(this.filters, params);
			this.setSort(this.filters.sort);
			const newProfiles = [...this.profiles];
			this.profiles = newProfiles;
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log(changes);
		if (changes['profiles']) {
			this.profiles = changes['profiles'].currentValue;

			if (changes['count']) {
				this.count = changes['count'].currentValue;
			}

			this.setPage(1);
		}

		if (changes['location']) {
			this.location = changes['location'].currentValue;
		}

		if (changes['sport']) {
			this.sport = changes['sport'].currentValue;
		}
	}

	setPage(page: number): void {
		let totalPages = Math.ceil(this.count / this.limit);

		if (page < 1 || (this.count > 0 && page > totalPages)) {
			return;
		}

		this.pager = this.pagerService.getPager(this.count, page, totalPages, this.limit);
		this._pagedProfiles = this.profiles.slice(this.pager.startIndex, this.pager.endIndex);
	}

	onSortChange() {
		this.router.navigate([], {
			queryParams: this.filters,
			relativeTo: this.route
		});
	}

	private setSort(sort: string): void {
		console.log('this.sort before:', this.sort);
		if (sort === 'rating') {
			this.sort = '-trainer.rating.average';
		} else if (sort === 'price') {
			this.sort = 'packages.0.price';
		} else if (sort === 'distance') {
			this.sort = 'dist.calculated';
		}
		console.log('this.sort has LITERALLY CHANGED, SO CAN THE PIPE REFIRE?', this.sort);
	}
}
