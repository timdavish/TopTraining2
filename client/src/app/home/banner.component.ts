import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Errors, SharedModule, UserService } from '../shared';

@Component({
	selector: 'home-banner',
	templateUrl: './banner.component.html',
	styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
	errors: Errors = new Errors();
	bannerView: string = '';
	isSubmitting: boolean = false;
	searchForm: FormGroup;
	address: Object;

	constructor(
		private fb: FormBuilder,
		private userService: UserService
	) {}

	ngOnInit(): void {
		this.searchForm = this.fb.group({
			'sport': ['', Validators.required],
			'location': ['', Validators.required]
		});
	}

	public submitForm(): void {
		this.isSubmitting = true;
		this.errors = new Errors();

	}

	public getAddress(place: Object): void {
        this.address = place['formatted_address'];
        var location = place['geometry']['location'];
        var lat =  location.lat();
        var lng = location.lng();
        console.log("Address Object", place);
    }
}
