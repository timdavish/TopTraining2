import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { SearchQuery, searchQueryState, TrainerProfile } from 'app/shared/models';
import { LocationService } from 'app/core/services';
import { SearchService } from './search.service';

@Injectable()
export class SearchResolver implements Resolve<{ profiles: TrainerProfile[], count: number }> {
	constructor(
		private locationService: LocationService,
		private router: Router,
		private searchService: SearchService
	) {}

	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<any> {
		const query = searchQueryState;
		for (const key in route.params) {
			query[key] = route.params[key];
		}

		if (this.isSufficient(query)) {
			return this.locationService.geocode(query.location)
				.mergeMap(coordinates => {
					query.lat = coordinates.lat;
					query.long = coordinates.long;
					return this.searchService.search(query);
				}).catch(err => {
					this.router.navigateByUrl('/');
					return err;
				}).first();
		} else {
			this.router.navigateByUrl('/');
		}
	}

	private isSufficient(query: SearchQuery): boolean {
		return !!query.sport && !!query.location;
	}
}
