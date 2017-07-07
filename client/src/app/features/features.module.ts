import { NgModule } from '@angular/core';

import { ApplyModule } from './apply/apply.module';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	imports: [
		ApplyModule,
		AuthModule,
		HomeModule,
		SharedModule
	],
	declarations: []
})
export class FeaturesModule {}
