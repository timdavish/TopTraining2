import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { AuthModule } from './auth/auth.module';
import { ApplyModule } from './apply/apply.module';
import { HomeModule } from './home/home.module';
import {
	SharedModule,

	FooterComponent,
	HeaderComponent,

	ApiService,
	AuthGuard,
	DeactivateGuard,
	JwtService,
	LocationService,
	SportService,
	TrainerGuard,
	UserService
} from './shared';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([], { useHash: true });

@NgModule({
	declarations: [
		AppComponent,
		FooterComponent,
		HeaderComponent
	],
	imports: [
		AuthModule,
		ApplyModule,
		BrowserModule,
		HomeModule,
		SharedModule,

		rootRouting
	],
	providers: [
		ApiService,
		AuthGuard,
		DeactivateGuard,
		JwtService,
		LocationService,
		SportService,
		TrainerGuard,
		UserService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
