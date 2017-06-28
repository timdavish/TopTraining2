import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard, SharedModule } from '../shared';
import { EditorTrainerAppComponent } from './editor-trainer-app.component';

const editorRouting: ModuleWithProviders = RouterModule.forChild([
	{
		path: 'editor',
		canActivate: [AuthGuard],
		children: [
			{
				path: 'trainer_app',
				component: EditorTrainerAppComponent,

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
		EditorTrainerAppComponent
	]
})
export class EditorModule { }
