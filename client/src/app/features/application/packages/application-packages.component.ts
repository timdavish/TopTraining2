import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { Application } from '../shared/application.model';
import { ApplicationService } from '../shared/application.service';
import { UserService } from 'app/core/services';
import { Errors, packageOptions, Sport, User } from 'app/shared';

@Component({
	selector: 'application-packages',
	templateUrl: './application-packages.component.html'
})
export class ApplicationPackagesComponent implements OnDestroy, OnInit {
	private readonly next = 'availability';
	private readonly options = packageOptions;

	application: Application;
	errors: Errors = new Errors();
	isSubmitting: boolean = false;
	packagesForm: FormGroup;
	user: User = new User();

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private applicationService: ApplicationService,
		private fb: FormBuilder,
		private router: Router,
		private userService: UserService
	) {}

	ngOnInit() {
		// Make a fresh copy of the current user's object to place in form
		(<any>Object).assign(this.user, this.userService.getCurrentUser());
		// Get our application from localStorage, otherwise the application is
		// compromised and we need to restart
		this.application = this.applicationService.retrieveApplication();
		// Build the form group
		this.createFormGroup();
		// Fill the form (if necessary)
		this.packagesForm.patchValue(this.application);
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
		this.updateapplication(this.packagesForm.value);
		this.applicationService.updateApplication(this.application);

		this.router.navigateByUrl('/trainer_app/apply/' + this.next);
	}

	private createFormGroup(): void {
		// Use FormBuilder to create our form group
		this.packagesForm = this.fb.group({
			'session_length': ['', Validators.required],
			'session_rate': ['', Validators.required],
			'session_type_private': ['', Validators.required],
			'session_type_small': ['', Validators.required],
			'session_type_large': ['', Validators.required]
		});
	}

	private updateapplication(values: Object): void {
		(<any>Object).assign(this.application, values);
	}
}
