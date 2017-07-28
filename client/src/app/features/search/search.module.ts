import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialModule, SharedModule } from 'app/shared';
import { SearchComponent } from './search.component';
import { SearchFilterComponent } from './filter/search-filter.component';
import { SearchFormComponent } from './form/search-form.component';
import { SearchListComponent } from './list/search-list.component';
import { SearchPreviewComponent } from './preview/search-preview.component';
import { SearchResolver } from './shared/search-resolver.service';
import { SearchService } from './shared/search.service';

const searchRouting: ModuleWithProviders = RouterModule.forChild([
	{
		path: 'search/:sport/:location',
		runGuardsAndResolvers: 'paramsChange',
		component: SearchComponent,
		resolve: {
			data: SearchResolver
		}
	}
]);

@NgModule({
	imports: [
		MaterialModule,
		searchRouting,
		SharedModule
	],
	declarations: [
		SearchComponent,
		SearchFilterComponent,
		SearchFormComponent,
		SearchListComponent,
		SearchPreviewComponent
	],
	providers: [
		SearchResolver,
		SearchService
	],
	exports: [
		SearchFormComponent
	]
})
export class SearchModule {}
