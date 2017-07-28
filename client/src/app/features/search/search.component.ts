import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { TrainerProfile } from 'app/shared/models';

@Component({
	selector: 'search',
	templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit {
	isLoading: boolean = false;
	profiles: TrainerProfile[] = [];
	count: number = 0;
	sport: string = '';
	location: string = '';
	showForm: boolean = false;

	constructor(
		private route: ActivatedRoute
	) {}

	ngOnInit(): void {
		// Subscribe to route params
		this.route.params.subscribe(params => {
			this.sport = params['sport'];
			this.location = params['location'];
		});

		// Subscribe to route data
		this.route.data.map(data => data.data).subscribe(
			(data: { profiles: TrainerProfile[], count: number }) => {
				this.profiles = data.profiles;
				this.count = data.count;
			}
		);
	}

	switchFormStatus(status: boolean) {
		this.showForm = status;
	}
}
