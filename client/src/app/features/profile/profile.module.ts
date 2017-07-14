import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard, ClientGuard } from 'app/core/guards';
import { SharedModule } from 'app/shared';
import { ProfileClientComponent } from '../profile/client/profile-client.component';
import { ProfileTrainerComponent } from '../profile/trainer/profile-trainer.component';
import { ProfileService } from './shared/profile.service';

const profileRouting: ModuleWithProviders = RouterModule.forChild([
	{
		path: 'profile/clients/:id',
		component: ProfileClientComponent,
		canActivate: [AuthGuard, ClientGuard]
	},
	{
		path: 'profile/trainers/:id',
		component: ProfileTrainerComponent
	}
]);

@NgModule({
	imports: [
		profileRouting,
		SharedModule
	],
	declarations: [
		ProfileClientComponent,
		ProfileTrainerComponent
	],
	providers: [
		ProfileService
	]
})
export class EditorModule {}
