import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { UserService } from 'app/core/services/user.service';
import { Errors } from 'app/shared';

@Component({
	selector: 'auth-page',
	templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy, OnInit {
	private readonly titles = {
		login: 'Log In',
		register: 'Sign Up',
		trainer_app: 'Trainer Application'
	};

	authForm: FormGroup;
	authType: string = '';
	buttonText: string = '';
	errors: Errors = new Errors();
	isSubmitting: boolean = false;
	title: string = '';

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private router: Router,
		private userService: UserService
	) {}

	ngOnInit(): void {
		this.route.url
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				data => {
					// Get and set whether we're on login, register or trainer_app page
					this.authType = data[data.length - 1].path;
					// Set title for the page accordingly
					this.title = (this.authType === 'login') ? this.titles.login :
						(this.authType === 'register' ? this.titles.register : this.titles.trainer_app);
					// Set button text for the page accordingly
					this.buttonText = (this.authType === 'login') ? this.titles.login :
						(this.authType === 'register' ? this.titles.register : 'Continue');
					// Build the form group
					this.createFormGroup();
				},
				err => {}
			);
	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	public submitForm(): void {
		this.errors = new Errors();
		this.isSubmitting = true;

		let credentials = this.authForm.value;

		// If registering, set usertype
		if (this.authType === 'register') {
			credentials.usertype = 'client';
		} else if (this.authType === 'trainer_app') {
			credentials.usertype = 'trainer';
		}

		this.userService.attemptAuth(this.authType, credentials)
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				data => {
					const route = this.authType === 'trainer_app' ? '/trainer_app/apply/background' : '/';
					this.router.navigateByUrl(route)
				},
				err => {
					this.errors = err;
					this.isSubmitting = false;
				}
			);
	}

	private createFormGroup(): void {
		// Use FormBuilder to create our starting form group
		this.authForm = this.fb.group({
			'email': ['', Validators.required],
			'password': ['', Validators.required]
		});

		if (this.authType === 'register' || this.authType === 'trainer_app') {
			// Add firstname, lastname, confirm password, controls
			this.authForm.addControl('firstname', new FormControl('', Validators.required));
			this.authForm.addControl('lastname', new FormControl('', Validators.required));
			this.authForm.addControl('password_verify', new FormControl('', Validators.required));
		}

		if (this.authType === 'register') {
			// Add zipcode control
			this.authForm.addControl('zipcode', new FormControl());
		}

		if (this.authType === 'trainer_app') {
			// Add phone control
			this.authForm.addControl('phone', new FormControl());
		}
	}
}
