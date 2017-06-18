import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module';
import {
	SharedModule,

	FooterComponent,
	HeaderComponent,

	ApiService,
	JwtService,
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
		BrowserModule,
		HomeModule,
		SharedModule,

		rootRouting
	],
	providers: [
		ApiService,
		JwtService,
		UserService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
