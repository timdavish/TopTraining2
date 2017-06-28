import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BannerComponent } from './banner.component';
import { HomeComponent } from './home.component';

import { SharedModule } from '../shared';

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
		SharedModule
	],
	declarations: [
		BannerComponent,
		HomeComponent
	],
	providers: []
})
export class HomeModule {}
