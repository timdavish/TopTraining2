import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared';
import { SearchModule } from '../search/search.module';

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
		SearchModule
	],
	declarations: [
		BannerComponent,
		HomeComponent
	],
	providers: []
})
export class HomeModule {}
