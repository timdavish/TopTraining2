import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Errors, SharedModule } from '../shared';

@Component({
	selector: 'home-banner',
	templateUrl: './banner.component.html',
	styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
	address: Object;
	bannerView: string = '';
	errors: Errors = new Errors();
	isSubmitting: boolean = false;
	searchForm: FormGroup;

	constructor(
		private fb: FormBuilder
	) {}

	ngOnInit(): void {
		this.searchForm = this.fb.group({
			'sport': ['', Validators.required],
			'location': ['', Validators.required]
		});
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
}
