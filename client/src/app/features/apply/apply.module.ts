import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from 'app/core/guards/auth-guard.service';
import { DeactivateGuard } from 'app/core/guards/deactivate-guard.service';
import { TrainerGuard } from 'app/core/guards/trainer-guard.service';
import { SharedModule } from 'app/shared';
import { ApplyComponent } from './apply.component';
import { ApplyBackgroundComponent } from './apply-background.component';
import { ApplyPackagesComponent } from './apply-packages.component';

const applyRouting: ModuleWithProviders = RouterModule.forChild([
	{
		path: 'trainer_app/apply',
		component: ApplyComponent,
		canActivate: [AuthGuard, TrainerGuard],
		canDeactivate: [DeactivateGuard],
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'background'
			},
			{
				path: 'background',
				component: ApplyBackgroundComponent
			},
			{
				path: 'packages',
				component: ApplyPackagesComponent
			},
			{
				path: 'availability',
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
		ApplyBackgroundComponent,
		ApplyPackagesComponent
	]
})
export class ApplyModule {}
