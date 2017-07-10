import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { ApplyService } from './apply.service';
import { UserService } from 'app/core/services';
import { Errors, Sport, TrainerProfile, User } from 'app/shared';

import { packageOptions } from './packages.options';

@Component({
	selector: 'apply-packages',
	templateUrl: './apply-packages.component.html'
})
export class ApplyPackagesComponent implements OnDestroy, OnInit {
	private readonly next = 'background';
	// private readonly next = 'availability';
	private readonly options = packageOptions;

	errors: Errors = new Errors();
	isSubmitting: boolean = false;
	packagesForm: FormGroup;
	profile: any;
	user: User = new User();

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private applyService: ApplyService,
		private fb: FormBuilder,
		private router: Router,
		private userService: UserService
	) {}

	ngOnInit() {
		// Make a fresh copy of the current user's object to place in form
		(<any>Object).assign(this.user, this.userService.getCurrentUser());
		// Get our profile from localStorage or create a new one
		this.profile = this.applyService.retrieveProfile() || {};
		// Build the form group
		this.createFormGroup();
		// Fill the form (if necessary)
		this.packagesForm.patchValue(this.profile);
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
		this.updateProfile(this.packagesForm.value);
		this.applyService.updateProfile(this.profile);

		this.router.navigateByUrl('/trainer_app/apply/' + this.next);
	}

	private createFormGroup(): void {
		// Use FormBuilder to create our form group
		this.packagesForm = this.fb.group({
			'session_length': ['', Validators.required],
			'session_rate': ['', Validators.required]
		});
	}

	private updateProfile(values: Object): void {
		(<any>Object).assign(this.profile, values);
	}
}
