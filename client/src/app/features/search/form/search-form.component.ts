import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { LocationService, SportService } from 'app/core/services';
import { Errors, SearchQuery, searchQueryState, Sport } from 'app/shared/models';

@Component({
	selector: 'search-form',
	templateUrl: './search-form.component.html'
})
export class SearchFormComponent implements OnDestroy, OnInit {
	// @Input() set query(query: SearchQuery) {
	// 	console.error('setting query');
	// 	if (query) {
	// 		console.log('query passed', query);
	// 		// We pass the form our query from SearchComponent
	// 		this.query = query;
	// 	} else {
	// 		console.log('no query passed', query);
	// 		// We don't pass the form our query from BannerComponent
	// 		this.query = searchQueryState;
	// 		this.setLocation();
	// 	}
	// }
	@Input() query: SearchQuery;
	errors: Errors = new Errors();
	isSubmitting: boolean = false;
	searchForm: FormGroup;
	sports: Sport[] = [];
	filteredSports: Observable<Sport[]>;

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private fb: FormBuilder,
		private locationService: LocationService,
		private router: Router,
		private sportService: SportService
	) {}

	ngOnInit(): void {
		console.log('ngOnInit start', this.query);
		if (!this.query) {
			this.query = searchQueryState;
			this.setLocation();
		}
		// Get our list of sports
		this.sportService.getSports()
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				sports => {
					this.sports = sports;
				},
				err => {}
			);
		// Build the form group
		this.createFormGroup();
		// Set filteredSports
		this.filteredSports = this.searchForm.controls['sport'].valueChanges
			.startWith(null)
			.map(val => val ? this.filterSports(val) : this.sports.slice());
		console.log('ngOnInit finish', this.query);
	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	private createFormGroup(): void {
		console.log('creating form group');
		this.searchForm = this.fb.group({
			'sport': [this.query.sport, Validators.required],
			'location': [this.query.location, Validators.required]
		});
	}

	public getAddress(place: any): void {
        this.query.location = place.formatted_address;
    }

	public submitForm(): void {
		this.query = searchQueryState;
		this.errors = new Errors();
		this.isSubmitting = true;

		// update the model
	    this.updateSearchQuery(this.searchForm.value);

		this.locationService.geocode(this.query.location)
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				coordinates => {
					this.query.lat = coordinates.lat;
					this.query.long = coordinates.long;
					this.router.navigate(['search',], { queryParams: this.query });
				},
				err => {
					this.errors = err;
					this.isSubmitting = false;
				}
			);
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
				console.log('set location', this.query);
			});
	}

	private filterSports(val: string): Sport[] {
		return this.sports.filter(sport => new RegExp(`^${val}`, 'gi').test(sport.sport));
	}

	private updateSearchQuery(values: Object): void {
		(<any>Object).assign(this.query, values);
	}
}
