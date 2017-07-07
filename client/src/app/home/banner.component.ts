import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Errors, SharedModule, Sport, SportService } from '../shared';

@Component({
	selector: 'home-banner',
	templateUrl: './banner.component.html',
	styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnDestroy, OnInit {
	address: Object;
	bannerView: string = '';
	errors: Errors = new Errors();
	isSubmitting: boolean = false;
	searchForm: FormGroup;
	sports: Array<Sport>;

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private fb: FormBuilder,
		private sportService: SportService
	) {}

	ngOnInit(): void {
		// Populate sports
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
	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	public getAddress(place: Object): void {
        this.address = place['formatted_address'];
        var location = place['geometry']['location'];
        var lat =  location.lat();
        var lng = location.lng();
        console.log("Address Object", place);
    }

	public submitForm(): void {
		this.isSubmitting = true;
		this.errors = new Errors();

	}

	private createFormGroup(): void {
		this.searchForm = this.fb.group({
			'sport': ['', Validators.required],
			'location': ['', Validators.required]
		});
	}
}
