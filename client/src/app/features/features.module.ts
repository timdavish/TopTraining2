import { NgModule } from '@angular/core';

import { AdminModule } from './admin/admin.module';
import { ApplicationModule } from './application/application.module';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import { ProfileModule } from './profile/profile.module';
import { SearchModule } from './search/search.module';
import { SupportModule } from './support/support.module';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
	imports: [
		AdminModule,
		ApplicationModule,
		AuthModule,
		HomeModule,
		ProfileModule,
		SearchModule,
		SupportModule,
		SharedModule
	],
	declarations: []
})
export class FeaturesModule {}
