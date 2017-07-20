import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MaterialModule, SharedModule } from 'app/shared';
import { SearchComponent } from './search.component';
import { SearchFilterComponent } from './filter/search-filter.component';
import { SearchListComponent } from './list/search-list.component';
import { SearchService } from './shared/search.service';

const searchRouting: ModuleWithProviders = RouterModule.forChild([
	{
		path: 'search/list',
		component: SearchListComponent
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
		SearchListComponent
	],
	providers: [
		SearchService
	],
	exports: [
		SearchComponent
	]
})
export class SearchModule {}
