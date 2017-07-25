import { Component, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Pager, PagerService } from 'app/core/services'
import { SearchService } from '../shared/search.service';
import { Errors, SearchFilters, SearchQuery, TrainerProfile } from 'app/shared/models';

@Component({
	selector: 'search-list',
	templateUrl: './search-list.component.html',
	styleUrls: ['./search-list.component.css']
})
export class SearchListComponent implements OnDestroy {
	@Input() filters: SearchFilters;
	@Input() query: SearchQuery;
	@Input() set profiles(profiles: TrainerProfile[]) {
		if (profiles && profiles.length) {
			this.profileList = profiles;
			this.setPage(1);
		}
	};

	errors: Errors = new Errors();
	limit: number = 5;
	profileList: TrainerProfile[];
	pageSize: number = 0;
	pager: Pager = new Pager();
	pagedProfiles: TrainerProfile[];

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private pagerService: PagerService,
		private searchService: SearchService
	) {}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	setPage(page: number): void {
		if (page < 1 || page > this.pager.totalPages) {
			return;
		}

		this.pager = this.pagerService.getPager(this.profileList.length, page, this.limit);
		this.pagedProfiles = this.profileList.slice(this.pager.startIndex, this.pager.endIndex);
	}
}
