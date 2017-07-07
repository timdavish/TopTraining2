import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'apply-page',
	templateUrl: './apply.component.html'
})
export class ApplyComponent {
	constructor(
		private router: Router
	) {}
}
