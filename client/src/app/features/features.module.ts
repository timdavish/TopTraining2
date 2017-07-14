import { NgModule } from '@angular/core';

import { AgmCoreModule } from '@agm/core';

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
		AgmCoreModule.forRoot({ apiKey: 'AIzaSyC9Z9C7BKbBVCQutt_kAJ9nlQsqNykCT_M', libraries: ['places', 'visualization'] }),
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
