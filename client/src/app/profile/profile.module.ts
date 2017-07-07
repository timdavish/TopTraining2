import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard, SharedModule } from '../shared';

const editorRouting: ModuleWithProviders = RouterModule.forChild([
	{
		path: 'profile',
		children: [
			{
				// path: 'trainer/:id',
				// component: EditorTrainerAppComponent
			},
			{
				// path: 'client/:id',
				// component: EditorTrainerAppComponent,
				// canActivate: [ClientGuard]
			}
		]
	}
]);

@NgModule({
	imports: [
		editorRouting,
		SharedModule
	],
	declarations: [

	]
})
export class EditorModule {}
