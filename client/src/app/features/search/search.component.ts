import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { LocationService, SportService } from 'app/core/services';
import { Errors, Search, Sport } from 'app/shared/models';

@Component({
	selector: 'search',
	templateUrl: './search.component.html'
})
export class SearchComponent implements OnDestroy, OnInit {
	address: string = '';
	errors: Errors = new Errors();
	isSubmitting: boolean = false;
	place: Object;
	search: Search = {};
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
		// Get our list of sports
		this.sportService.getSports()
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				sports => {
					this.sports = sports;
				},
				err => {}
			);
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
				this.address = formatted;
			});
		// Build the form group
		this.createFormGroup();
		// Set filteredSports
		this.filteredSports = this.searchForm.controls['sport'].valueChanges
			.startWith(null)
			.map(val => val ? this.filter(val) : this.sports.slice());

	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	private createFormGroup(): void {
		this.searchForm = this.fb.group({
			'sport': ['', Validators.required],
			'location': ['', Validators.required]
		});
	}

	public getAddress(place: Object): void {
        this.place = place;
    }

	public submitForm(): void {
		this.errors = new Errors();
		this.isSubmitting = true;

		// update the model
	    this.updateSearch(this.searchForm.value);
		this.locationService.geocode(this.search.location)
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				coordinates => {
					this.search.lat = coordinates.lat;
					this.search.long = coordinates.long;
					this.router.navigate(['search/list',], { queryParams: this.search });
					// this.router.navigate(['search',], { queryParams: { param: param, etc } });
				},
				err => {
					this.errors = err;
					this.isSubmitting = false;
				}
			);
	}

	private filter(val: string): string[] {
		return this.sports.filter(sport => new RegExp(`^${val}`, 'gi').test(sport.sport));
	}

	private updateSearch(values: Object): void {
		(<any>Object).assign(this.search, values);
	}
}
