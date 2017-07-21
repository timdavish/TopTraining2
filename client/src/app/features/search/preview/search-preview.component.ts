import { Component, Input } from '@angular/core';

import { TrainerProfile } from 'app/shared/models';

@Component({
	selector: 'search-preview',
	templateUrl: './search-preview.component.html'
})
export class SearchPreviewComponent {
	@Input() location: string;
	@Input() profile: TrainerProfile;

	constructor() {}

	onToggleSave(saved: boolean): void {
		this.profile['saved'] = saved;
	}
}
