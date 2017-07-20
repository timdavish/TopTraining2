import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ApiService } from 'app/core/services';
import { TrainerProfile } from 'app/shared/models';

@Injectable()
export class SearchService {
	constructor(
		private apiService: ApiService
	) {}

	search(config: any): Observable<{trainerProfiles: TrainerProfile[], count: number}> {
		const params = new URLSearchParams();

		Object.keys(config.filters).forEach((key) => {
			params.set(key, config.filters[key]);
		});

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
