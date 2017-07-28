import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { LocationService, SportService } from 'app/core/services';
import { Errors, SearchQuery, searchQueryState, Sport } from 'app/shared/models';

@Component({
	selector: 'search-form',
	templateUrl: './search-form.component.html'
})
export class SearchFormComponent implements OnDestroy, OnInit {
	query: SearchQuery = searchQueryState;
	errors: Errors = new Errors();
	isSubmitting: boolean = false;
	searchForm: FormGroup;
	sports: Sport[] = [];
	filteredSports: Observable<Sport[]>;

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private fb: FormBuilder,
		private locationService: LocationService,
		private route: ActivatedRoute,
		private router: Router,
		private sportService: SportService
	) {}

	ngOnInit(): void {
		// Get our list of sports
		this.sportService.getSports()
			.takeUntil(this.ngUnsubscribe)
			.subscribe(sports => {
				this.sports = sports;
			});

		// Get params if they exist
		this.route.params.takeUntil(this.ngUnsubscribe)
			.subscribe(params => {
				if (params && params['sport'] && params['location']) {
					this.query.sport = params['sport'];
					this.query.location = params['location'];
				} else {
					this.setLocation();
				}
			});

		// Build the form group
		this.createFormGroup();

		// Set filteredSports
		this.filteredSports = this.searchForm.controls['sport'].valueChanges
			.startWith(null)
			.map(val => val ? this.filterSports(val) : this.sports.slice());
	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	createFormGroup(): void {
		this.searchForm = this.fb.group({
			'sport': ['', Validators.required],
			'location': ['', Validators.required]
		});
	}

	getAddress(place: any): void {
        this.query.location = place.formatted_address;
    }

	submitForm(): void {
		this.errors = new Errors();
		this.isSubmitting = true;

		if (this.query.sport && this.query.location) {
			this.router.navigate(['/search', this.query.sport, this.query.location]);
		}

		this.isSubmitting = false;
	}

	private setLocation(): void {
		// Attempt to get user's current location
		this.locationService.getLocation()
			.flatMap(position => {
				const lat = position.coords.latitude;
				const long = position.coords.longitude;
				return this.locationService.reverseGeocode(lat, long);
			})
			.flatMap(locations => {
				return this.locationService.parseAddressComponents(locations[0]);
			})
			.takeUntil(this.ngUnsubscribe)
			.subscribe(components => {
				const formatted = `${components.locality}, ${components.administrative_area_level_1} ${components.postal_code}`;
				this.query.location = formatted;
			});
	}

	private filterSports(val: string): Sport[] {
		return this.sports.filter(sport => new RegExp(`^${val}`, 'gi').test(sport.sport));
	}
}
