import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Errors, UserService } from '../shared';

@Component({
	selector: 'trainer-app',
	templateUrl: 'trainer-app.component.html'
})
export class TrainerAppComponent implements OnDestroy, OnInit {
	private ngUnsubscribe: Subject<void> = new Subject<void>();

	errors: Errors = new Errors();
	appView: string = '';
	isSubmitting: boolean = false;
	authForm: FormGroup;

	constructor(
		private fb: FormBuilder,
		private userService: UserService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.createFormGroup();
	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	private createFormGroup(): void {
		// Use FormBuilder to create our form group
		this.authForm = this.fb.group({
			'firstname': ['', Validators.required],
			'lastname': ['', Validators.required],
			'email': ['', Validators.required],
			'phone': ['', Validators.required],
			'password': ['', Validators.required],
			'password_verify': ['', Validators.required]
		});
	}

	public submitForm(): void {
		this.isSubmitting = true;
		this.errors = new Errors();

		const credentials = this.authForm.value;
		this.userService.attemptAuth('trainer_app', credentials)
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				data => {
					this.router.navigateByUrl('/')
				},
				err => {
					this.errors = err;
					this.isSubmitting = false;
				}
			);
	}
}
