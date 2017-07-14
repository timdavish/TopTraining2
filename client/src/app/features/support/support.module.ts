import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard, ClientGuard } from 'app/core/guards';
import { SharedModule } from 'app/shared';
import { SupportComponent } from './support.component';
import { SupportContactComponent } from './contact/support-contact.component';
import { SupportFaqComponent } from './faq/support-faq.component';
import { SupportPrivacyComponent } from './privacy/support-privacy.component';
import { SupportTosComponent } from './tos/support-tos.component';
import { SupportService } from './shared/support.service';

const supportRouting: ModuleWithProviders = RouterModule.forChild([
	{
		path: 'support',
		component: SupportComponent,
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'contact'
			},
			{
				path: 'contact',
				component: SupportContactComponent
			},
			{
				path: 'faq',
				component: SupportFaqComponent
			},
			{
				path: 'privacy',
				component: SupportPrivacyComponent
			},
			{
				path: 'tos',
				component: SupportTosComponent
			}
		]
	}
]);

@NgModule({
	imports: [
		supportRouting,
		SharedModule
	],
	declarations: [
		SupportComponent,
		SupportContactComponent,
		SupportFaqComponent,
		SupportPrivacyComponent,
		SupportTosComponent
	],
	providers: [
		SupportService
	]
})
export class SupportModule {}
