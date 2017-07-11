import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { CoreModule } from './core/core.module';
import { FeaturesModule } from './features/features.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';

const rootRouting: ModuleWithProviders = RouterModule.forRoot([
	// {
	// 	path: '',
	// 	loadChildren: 'app/features/features.module#FeaturesModule'
	// },
	{
		path: '**',
		redirectTo: '/'
	}
], { useHash: false });

@NgModule({
	imports: [BrowserModule, CoreModule, FeaturesModule, SharedModule, rootRouting],
	declarations: [AppComponent],
	bootstrap: [AppComponent]
})
export class AppModule {}
