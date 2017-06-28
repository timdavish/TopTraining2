import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Errors, UserService } from '../shared';

const LOGIN_TITLE = 'Log In';
const REGISTER_TITLE = 'Sign Up';
const TRAINER_APP_TITLE = 'Trainer Application';

@Component({
	selector: 'auth-page',
	templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy, OnInit {
	private ngUnsubscribe: Subject<void> = new Subject<void>();

	errors: Errors = new Errors();
	authType: string = '';
	title: string = '';
	buttonText: string = '';
	isSubmitting: boolean = false;
	authForm: FormGroup;

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
					// Get and set whether we're on login or register
					this.authType = data[data.length - 1].path;
					// Set title for the page accordingly
					this.title = (this.authType === 'login') ? LOGIN_TITLE : (this.authType === 'register' ? REGISTER_TITLE : TRAINER_APP_TITLE);
					// Set button text for the page accordingly
					this.buttonText = (this.authType === 'login') ? LOGIN_TITLE : (this.authType === 'register' ? REGISTER_TITLE : 'Continue');
					// Add extra form controls if this is the register page
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
			this.authForm.addControl('phone', new FormControl('', Validators.required));
		}
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

		console.log(credentials);

		this.userService.attemptAuth(this.authType, credentials)
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				data => {
					let route = '/';
					if (this.authType === 'trainer_app') `${route}editor/trainer_app`;
					this.router.navigateByUrl(route)
				},
				err => {
					this.errors = err;
					this.isSubmitting = false;
				}
			);
	}
}
