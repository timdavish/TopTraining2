import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ShowAuthedDirective } from './directives/show-authed.directive';

@NgModule({
	imports: [
		CommonModule,
		HttpModule,
		RouterModule
	],
	declarations: [
		ShowAuthedDirective
	],
	exports: [
		CommonModule,
		HttpModule,
		RouterModule,

		ShowAuthedDirective
	]
})
export class SharedModule {}
