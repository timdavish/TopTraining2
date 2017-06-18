import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { ListErrorsComponent } from './errors/list-errors.component';

import { ShowAuthedDirective } from './directives/show-authed.directive';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		RouterModule
	],
	declarations: [
		ListErrorsComponent,

		ShowAuthedDirective
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		RouterModule,

		ListErrorsComponent,

		ShowAuthedDirective
	]
})
export class SharedModule {}
