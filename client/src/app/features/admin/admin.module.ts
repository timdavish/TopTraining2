import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminGuard, AuthGuard, DeactivateGuard } from 'app/core/guards';
import { SharedModule } from 'app/shared';
import { AdminComponent } from './admin.component';
import { AdminAuditComponent } from './audit/admin-audit.component';
import { AdminDashboardComponent } from './dashboard/admin-dashboard.component';
import { AdminPromosComponent } from './promos/admin-promos.component';
import { AdminSportsComponent } from './sports/admin-sports.component';
import { AdminUsersComponent } from './users/admin-users.component';
import { AdminService } from './shared/admin.service';
import { ApproveButtonComponent } from './shared/approve-button.component';

const adminRouting: ModuleWithProviders = RouterModule.forChild([
	{
		path: 'admin',
		component: AdminComponent,
		canActivate: [AuthGuard, AdminGuard],
		children: [
			{
				path: '',
				component: AdminDashboardComponent
			},
			{
				path: 'audit',
				component: AdminAuditComponent
			},
			{
				path: 'promos',
				component: AdminPromosComponent
			},
			{
				path: 'sports',
				component: AdminSportsComponent
			},
			{
				path: 'users',
				component: AdminUsersComponent
			},
			{
				path: '**',
				redirectTo: ''
			}
		]
	}
]);

@NgModule({
	imports: [
		adminRouting,
		SharedModule
	],
	declarations: [
		AdminComponent,
		AdminAuditComponent,
		AdminDashboardComponent,
		AdminPromosComponent,
		AdminSportsComponent,
		AdminUsersComponent,
		ApproveButtonComponent
	],
	providers: [
		AdminService
	]
})
export class AdminModule {}
