import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ApiService } from 'app/core/services';
import { SearchFilters, SearchQuery, TrainerProfile } from 'app/shared/models';

@Injectable()
export class SearchService {
	constructor(
		private apiService: ApiService
	) {}

	search(query: SearchQuery): Observable<{profiles: TrainerProfile[], count: number}> {
		const params = new URLSearchParams();

		for (const key in query) {
			params.set(key, query[key]);
		}

		return this.apiService.get('/profiles/trainers', params)
			.map(data => data);
	}

	get(slug: string): Observable<TrainerProfile> {
		return this.apiService.get(`/profiles/${slug}`)
			.map(data => data);
	}

	save(slug: string): Observable<TrainerProfile> {
		return this.apiService.post(``);
	}

	unsave(slug: string): Observable<TrainerProfile> {
		return this.apiService.delete(``);
	}
}
