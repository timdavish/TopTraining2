import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard, DeactivateGuard, SharedModule, TrainerGuard } from '../shared';
import { ApplyBackgroundComponent } from './apply-background.component';

const applyRouting: ModuleWithProviders = RouterModule.forChild([
	{
		path: 'trainer_app/edit',
		component: ApplyBackgroundComponent,
		canActivate: [AuthGuard, TrainerGuard],
		canDeactivate: [DeactivateGuard]
	}
]);

@NgModule({
	imports: [
		applyRouting,
		SharedModule
	],
	declarations: [
		ApplyBackgroundComponent
	]
})
export class ApplyModule {}
