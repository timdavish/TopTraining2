import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AgmCoreModule } from '@agm/core';
import { AuthGuard, DeactivateGuard, TrainerGuard } from 'app/core/guards';
import { SharedModule } from 'app/shared';
import { ApplicationComponent } from './application.component';
import { ApplicationAvailabilityComponent } from './availability/application-availability.component';
import { ApplicationBackgroundComponent } from './background/application-background.component';
import { ApplicationPackagesComponent } from './packages/application-packages.component';
import { ApplicationService } from './shared/application.service';

const applicationRouting: ModuleWithProviders = RouterModule.forChild([
	{
		path: 'trainer_app/apply',
		component: ApplicationComponent,
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
				component: ApplicationBackgroundComponent
			},
			{
				path: 'packages',
				component: ApplicationPackagesComponent
			},
			{
				path: 'availability',
				component: ApplicationAvailabilityComponent
			}
		]
	}
]);

@NgModule({
	imports: [
		applicationRouting,
		SharedModule,
		AgmCoreModule
	],
	declarations: [
		ApplicationComponent,
		ApplicationAvailabilityComponent,
		ApplicationBackgroundComponent,
		ApplicationPackagesComponent
	],
	providers: [
		ApplicationService
	]
})
export class ApplicationModule {}
