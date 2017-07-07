import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard, DeactivateGuard, SharedModule, TrainerGuard } from '../shared';
import { ApplyComponent } from './apply.component';
import { ApplyBackgroundComponent } from './apply-background.component';

const applyRouting: ModuleWithProviders = RouterModule.forChild([
	{
		path: 'trainer_app/apply',
		component: ApplyComponent,
		canActivate: [AuthGuard, TrainerGuard],
		canDeactivate: [DeactivateGuard],
		children: [
			{
				path: 'background',
				component: ApplyBackgroundComponent
			}
		]
	}
]);

@NgModule({
	imports: [
		applyRouting,
		SharedModule
	],
	declarations: [
		ApplyComponent,
		ApplyBackgroundComponent
	]
})
export class ApplyModule {}
