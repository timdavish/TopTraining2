import { Component } from '@angular/core';

import { ApplyService } from './apply.service';

@Component({
	selector: 'apply-page',
	templateUrl: './apply.component.html',
	styleUrls: ['./apply.component.css']
})
export class ApplyComponent {
	constructor(
		private applyService: ApplyService
	) {}

	public cancelForm(): void {
		this.applyService.cancelApplication();
	}
}
