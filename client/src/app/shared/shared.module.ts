import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { ListErrorsComponent } from './list-errors/list-errors.component';
import { StarRatingComponent } from './star-rating/star-rating.component';

import { LocationAutocompleteDirective } from './directives/location-autocomplete.directive';
import { ShowAuthedDirective } from './directives/show-authed.directive';

import { AddCommasPipe } from './pipes/add-commas.pipe';
import { EllipsisPipe } from './pipes/ellipsis.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { MinutesToTimePipe } from './pipes/minutes-to-time.pipe';
import { SortPipe } from './pipes/sort.pipe';
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

		AddCommasPipe,
		EllipsisPipe,
		FilterPipe,
		MinutesToTimePipe,
		SortPipe,
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

		AddCommasPipe,
		EllipsisPipe,
		FilterPipe,
		MinutesToTimePipe,
		SortPipe,
		UppercaseFirstPipe
	]
})
export class SharedModule {}
