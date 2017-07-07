import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { AgeGroups, Errors, Sport, SportService, TrainerProfile, User, UserService } from '../shared';
import { Dates } from '../app.config';

@Component({
	selector: 'apply-background',
	templateUrl: './apply-background.component.html',
	styleUrls: ['./apply-background.component.css']
})
export class ApplyBackgroundComponent implements OnDestroy, OnInit {
	private readonly ages = AgeGroups;
	private readonly dates = Dates;
	private readonly next = 'packages';

	appForm: FormGroup;
	errors: Errors = new Errors();
	isSubmitting: boolean = false;
	profile: TrainerProfile = new TrainerProfile();
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
		// Build the form group
		this.createFormGroup();
	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	public submitForm(): void {
		this.errors = new Errors();
		this.isSubmitting = true;
		this.user.profiles.push(this.profile);

		this.userService.update(this.user)
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				updatedUser => {
					this.router.navigateByUrl('/trainer_app/apply/' + this.next);
				},
				err => {
					// Remove the profile from the user's profiles but keep the profile data
					this.user.profiles.filter((p) => { return p.sport === this.profile.sport; });
					this.errors = err;
					this.isSubmitting = false;
				}
			);
	}

	public cancelForm(): void {
		this.userService.delete(this.user)
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				data => {
					this.userService.purgeAuth();
					this.router.navigateByUrl('/register');
				},
				err => {}
			)
	}

	// Prevents the trainer from being able to apply to train a sport twice
	public hasSport(sport: string): boolean {
		return this.user.profiles.some(function(p) { return p.sport === sport; });
	}

	private createFormGroup(): void {
		// Use FormBuilder to create our form group
		this.appForm = this.fb.group({
			'profile.sport': ['', Validators.required],
			'contact.phone': [this.user.contact.phone, Validators.required],
			'contact.dob.year': ['', Validators.required],
			'contact.dob.month': ['', Validators.required],
			'contact.dob.day': ['', Validators.required],
			'contact.gender': ['', Validators.required],

			'contact.address.street_one': '',
			'contact.address.street_two': '',
			'contact.address.city': '',
			'contact.address.state': '',
			'contact.address.zipcode': '',


			'profile.summary': ['', Validators.required],
			'profile.credentials.experience': ['', Validators.required],
			'profile.credentials.school': ['', Validators.required],

			'profile.services.ages': [this.ages, Validators.required],
			'profile.services.positions': ['', Validators.required],
			'profile.services.specialties': ['', Validators.required],
		});
	}
}
