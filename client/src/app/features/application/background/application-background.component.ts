import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { Application } from '../shared/application.model';
import { ApplicationService } from '../shared/application.service';
import { SportService, UserService } from 'app/core/services';
import { Dates, Errors, Sport, User } from 'app/shared';

@Component({
	selector: 'application-background',
	templateUrl: './application-background.component.html',
	styleUrls: ['./application-background.component.css']
})
export class ApplicationBackgroundComponent implements OnDestroy, OnInit {
	private readonly dates = Dates;
	private readonly next = 'packages';

	application: Application;
	backgroundForm: FormGroup;
	errors: Errors = new Errors();
	isSubmitting: boolean = false;
	sports: Array<Sport> = [];
	user: User = new User();

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private applicationService: ApplicationService,
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
		// Get our application from localStorage or create a new one
		this.application = this.applicationService.retrieveApplication() || {};
		// Build the form group
		this.createFormGroup();
		// Fill the form (if necessary)
		this.backgroundForm.patchValue(this.application);
	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	public submitForm(): void {
		this.errors = new Errors();
		this.isSubmitting = true;

		// Update the stored model
		this.updateApplication(this.backgroundForm.value);
		this.applicationService.updateApplication(this.application);

		this.router.navigateByUrl('/trainer_app/apply/' + this.next);
	}

	// Prevents the trainer from being able to apply to train a sport twice
	public hasSport(sport: string): boolean {
		return this.user.profiles.some(function(p) { return p.sport === sport; });
	}

	private createFormGroup(): void {
		// Use FormBuilder to create our form group
		this.backgroundForm = this.fb.group({
			'sport': ['', Validators.required],
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

			'summary': ['', Validators.required],
			'experience': ['', Validators.required],
			'school': ['', Validators.required],

			'ages_adults': ['', Validators.required],
			'ages_kids': ['', Validators.required],
			'ages_teenagers': ['', Validators.required],
			'positions': ['', Validators.required],
			'specialties': ['', Validators.required],
		});
	}

	private updateApplication(values: Object): void {
		(<any>Object).assign(this.application, values);
	}
}
