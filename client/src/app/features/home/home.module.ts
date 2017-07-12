import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AgmCoreModule } from '@agm/core';
import { SharedModule } from 'app/shared';

import { BannerComponent } from './banner.component';
import { HomeComponent } from './home.component';

const homeRouting: ModuleWithProviders = RouterModule.forChild([
	{
		path: '',
		component: HomeComponent
	}
]);

@NgModule({
	imports: [
		CommonModule,
		homeRouting,
		SharedModule,
		AgmCoreModule
	],
	declarations: [
		BannerComponent,
		HomeComponent
	],
	providers: []
})
export class HomeModule {}
