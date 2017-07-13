import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ApplicationService } from './shared/application.service';

@Component({
	selector: 'application-page',
	templateUrl: './application.component.html',
	styleUrls: ['./application.component.css']
})
export class ApplicationComponent {
	constructor(
		private applicationService: ApplicationService,
		private router: Router
	) {}

	public cancelForm(): void {
		this.applicationService.cancelApplication();
		this.router.navigateByUrl('/register');
	}
}
