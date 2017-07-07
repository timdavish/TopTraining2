import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { UserService } from 'app/core/services/user.service';
import { Errors, Sport, TrainerProfile, User } from 'app/shared';

import { packageOptions } from './packages.options';

@Component({
	selector: 'apply-packages',
	templateUrl: './apply-packages.component.html'
})
export class ApplyPackagesComponent implements OnDestroy, OnInit {
	private readonly next = 'availability';
	private readonly options = packageOptions;
	private readonly profileItemName = 'TTTprofile';

	errors: Errors = new Errors();
	isSubmitting: boolean = false;
	packagesForm: FormGroup;

	profile: TrainerProfile;
	user: User = new User();

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private userService: UserService
	) {}

	ngOnInit() {
		// Make a fresh copy of the current user's object to place in form
		(<any>Object).assign(this.user, this.userService.getCurrentUser());
		// Get our profile from localStorage or create a new one
		this.profile = new TrainerProfile();
		// Build the form group
		this.createFormGroup();
	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	public submitForm(): void {
		// this.errors = new Errors();
		// this.isSubmitting = true;

		// Update the model
		this.updateProfile(this.packagesForm.value);

		// localStorage.setItem(this.profileItemName, JSON.stringify(this.profile));
		// console.log('StorageAfterSubmit:', JSON.parse(localStorage.getItem(this.profileItemName)));
		// this.router.navigateByUrl('/trainer_app/apply/' + this.next);

		// this.userService.update(this.user)
		// 	.takeUntil(this.ngUnsubscribe)
		// 	.subscribe(
		// 		updatedUser => {
		// 			localStorage.setItem(this.profileItemName, JSON.stringify(this.profile));
		// 			this.router.navigateByUrl('/trainer_app/apply/' + this.next);
		// 		},
		// 		err => {
		// 			// Remove the profile from the user's profiles but keep the profile data
		// 			// this.user.profiles.filter((p) => { return p.sport === this.profile.sport; });
		// 			this.errors = err;
		// 			this.isSubmitting = false;
		// 		}
		// 	);
	}

	private createFormGroup(): void {
		// Use FormBuilder to create our form group
		this.packagesForm = this.fb.group({
			'sport': [this.profile.sport, Validators.required],
			'phone': [this.user.contact.phone, Validators.required],
			'dob_year': ['', Validators.required],
			'dob_month': ['', Validators.required],
			'dob_day': ['', Validators.required],
			'gender': ['', Validators.required],
		});
	}

	private updateProfile(values: Object): void {
		console.log('Changing profile values', values);
		(<any>Object).assign(this.profile, values);
	}
}
