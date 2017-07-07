import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { SportService } from 'app/core/services/sport.service';
import { UserService } from 'app/core/services/user.service';
import { AgeGroups, Errors, Sport, TrainerProfile, User } from 'app/shared';
import { Dates } from 'app/shared/';

@Component({
	selector: 'apply-background',
	templateUrl: './apply-background.component.html',
	styleUrls: ['./apply-background.component.css']
})
export class ApplyBackgroundComponent implements OnDestroy, OnInit {
	private readonly ages = AgeGroups;
	private readonly dates = Dates;
	private readonly next = 'packages';
	private readonly profileItemName = 'TTTprofile';

	appForm: FormGroup;
	errors: Errors = new Errors();
	isSubmitting: boolean = false;
	profile: TrainerProfile;
	sports: Array<Sport> = [];
	user: User = new User();

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private sportService: SportService,
		private userService: UserService
	) {}

	ngOnInit() {
		// Make a fresh copy of the current user's object to place in form
		(<any>Object).assign(this.user, this.userService.getCurrentUser());
		// Populate sports
		this.sportService.getSports()
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				sports => {
					this.sports = sports;
				},
				err => {}
			);
		// Get our profile from localStorage or create a new one
		this.profile = new TrainerProfile();
		// Build the form group
		this.createFormGroup();
		// Fill the form (if necessary)
		this.appForm.patchValue(this.profile);

		console.log('Profile:', this.profile);
		// console.log('Form:', this.appForm);
	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	get getAges() {
	    return this.appForm.get('ages');
	}

	public submitForm(): void {
		console.log(this.ages);
		// this.errors = new Errors();
		// this.isSubmitting = true;

		// Update the model
		this.updateProfile(this.appForm.value);

		// this.user.profiles.push(this.profile);

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

	// Prevents the trainer from being able to apply to train a sport twice
	public hasSport(sport: string): boolean {
		return this.user.profiles.some(function(p) { return p.sport === sport; });
	}

	private createFormGroup(): void {
		// Use FormBuilder to create our form group
		this.appForm = this.fb.group({
			'sport': [this.profile.sport, Validators.required],
			'phone': [this.user.contact.phone, Validators.required],
			'dob_year': ['', Validators.required],
			'dob_month': ['', Validators.required],
			'dob_day': ['', Validators.required],
			'gender': ['', Validators.required],

			'address_street_one': '',
			'address_street_two': '',
			'address_city': '',
			'address_state': '',
			'address_zipcode': '',


			'summary': [this.profile.summary, Validators.required],
			'experience': ['', Validators.required],
			'school': ['', Validators.required],

			'ages': [this.buildAges(), Validators.required],
			'positions': ['', Validators.required],
			'specialties': ['', Validators.required],
		});

		// this.appForm.valueChanges
		// 	.takeUntil(this.ngUnsubscribe)
		// 	.subscribe(value => this.updateProfile(value));
	}

	private buildAges(): FormArray {
		const arr = this.ages.map(age => { return this.fb.control(age.selected); });
		return this.fb.array(arr)
	}

	private updateProfile(values: Object): void {
		console.log('Changing profile values', values);
		(<any>Object).assign(this.profile, values);
	}
}
