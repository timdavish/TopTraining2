import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Errors, SharedModule, Sport, User } from 'app/shared';

@Component({
	selector: 'home-banner',
	templateUrl: './banner.component.html',
	styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
	@Input() currentUser: User;
	@Input() sports: Sport[];

	address: Object;
	bannerView: string = '';
	errors: Errors = new Errors();
	isSubmitting: boolean = false;
	searchForm: FormGroup;

	constructor(
		private fb: FormBuilder
	) {}

	ngOnInit(): void {
		// Build the form group
		this.createFormGroup();
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
