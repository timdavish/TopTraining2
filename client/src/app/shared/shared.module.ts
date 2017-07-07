import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { ListErrorsComponent } from './errors/list-errors.component';
import { StarRatingComponent } from './star-rating/star-rating.component';

import { LocationAutocompleteDirective } from './directives/location-autocomplete.directive';
import { ShowAuthedDirective } from './directives/show-authed.directive';

import { MinutesToTimePipe } from './pipes/minutes-to-time.pipe';
import { UppercaseFirstPipe } from './pipes/uppercase-first.pipe';

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
		StarRatingComponent,

		LocationAutocompleteDirective,
		ShowAuthedDirective,

		MinutesToTimePipe,
		UppercaseFirstPipe
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		RouterModule,

		ListErrorsComponent,
		StarRatingComponent,

		LocationAutocompleteDirective,
		ShowAuthedDirective,

		MinutesToTimePipe,
		UppercaseFirstPipe
	]
})
export class SharedModule {}
