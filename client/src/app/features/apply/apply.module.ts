import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AgmCoreModule } from '@agm/core';
import { AuthGuard, DeactivateGuard, TrainerGuard } from 'app/core/guards';
import { SharedModule } from 'app/shared';
import { ApplyComponent } from './apply.component';
import { ApplyBackgroundComponent } from './apply-background.component';
import { ApplyPackagesComponent } from './apply-packages.component';
import { ApplyService } from './apply.service';

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
		SharedModule,
		AgmCoreModule.forRoot()
	],
	declarations: [
		ApplyComponent,
		ApplyBackgroundComponent,
		ApplyPackagesComponent
	],
	providers: [
		ApplyService
	]
})
export class ApplyModule {}
