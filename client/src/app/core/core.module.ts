import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AgmCoreModule, MapsAPILoader, NoOpMapsAPILoader } from '@agm/core';

import { SharedModule } from 'app/shared/shared.module';
import { FooterComponent } from './layout/footer.component';
import { HeaderComponent } from './layout/header.component';
import { AdminGuard } from './guards/admin-guard.service';
import { ApiService } from './services/api.service';
import { AuthGuard } from './guards/auth-guard.service';
import { ClientGuard } from './guards/client-guard.service';
import { DeactivateGuard } from './guards/deactivate-guard.service';
import { JwtService } from './services/jwt.service';
import { LocalStorageService } from './services/local-storage.service';
import { LocationService } from './services/location.service';
import { PagerService } from './services/pager.service';
import { SportService } from './services/sport.service';
import { TrainerGuard } from './guards/trainer-guard.service';

import { UserService } from './services/user.service';
import './rxjs-operators'; // Don't need to import rxjs operators anywhere else
import 'hammerjs';

@NgModule({
	imports: [
		AgmCoreModule.forRoot(),
		BrowserAnimationsModule,
		CommonModule,
		SharedModule
	],
	exports: [
		FooterComponent,
		HeaderComponent
	],
	declarations: [
		FooterComponent,
		HeaderComponent
	],
	providers: [
		{ provide: MapsAPILoader, useClass: NoOpMapsAPILoader },
		AdminGuard,
		ApiService,
		AuthGuard,
		ClientGuard,
		DeactivateGuard,
		JwtService,
		LocalStorageService,
		LocationService,
		PagerService,
		SportService,
		UserService,
		TrainerGuard
	]
})
export class CoreModule {
	constructor (@Optional() @SkipSelf() coreModule: CoreModule) {
		if (coreModule) {
			throw new Error('CoreModule is already loaded. Import it in the AppModule only');
		}
	}
}
