import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Errors, UserService } from '../shared';

const LOGIN_TITLE = 'Log In';
const REGISTER_TITLE = 'Sign Up';

@Component({
	selector: 'auth-page',
	templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
	authType: string = '';
	title: string = '';
	errors: Errors = new Errors();
	isSubmitting: boolean = false;
	authForm: FormGroup;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private userService: UserService,
		private fb: FormBuilder
	) {
		// Use FormBuilder to create our starting form group
		this.authForm = this.fb.group({
			'email': ['', Validators.required],
			'password': ['', Validators.required]
		});
	}

	ngOnInit(): void {
		this.route.url.subscribe(data => {
			// Get and set whether we're on login or register
			this.authType = data[data.length - 1].path;
			// Set title for the page accordingly
			this.title = (this.authType === 'login') ? 'Log In' : 'Sign Up';
			// Add extra form controls if this is the register page
			this.addFormControls();
		});
	}

	private addFormControls(): void {
		if (this.authType === 'register') {
			// Add firstname, lastname, confirm password, zipcode? controls
			this.authForm.addControl('firstname', new FormControl('', Validators.required));
			this.authForm.addControl('lastname', new FormControl('', Validators.required));
			this.authForm.addControl('password_verify', new FormControl('', Validators.required));
		}
	}

	public submitForm(): void {
		this.isSubmitting = true;
		this.errors = new Errors();

		const credentials = this.authForm.value;
		this.userService.attemptAuth(this.authType, credentials)
			.subscribe(
				data => {
					this.router.navigateByUrl('/')
				},
				err => {
					this.errors = err;
					this.isSubmitting = false;
				}
			)
	}
}
