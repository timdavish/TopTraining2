import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { AuthModule } from './auth/auth.module';
import { EditorModule } from './editor/editor.module';
import { HomeModule } from './home/home.module';
import {
	SharedModule,

	FooterComponent,
	HeaderComponent,

	ApiService,
	AuthGuard,
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
		EditorModule,
		BrowserModule,
		HomeModule,
		SharedModule,

		rootRouting
	],
	providers: [
		ApiService,
		AuthGuard,
		JwtService,
		UserService
	],
	bootstrap: [AppComponent]
})
export class AppModule {}
