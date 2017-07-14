import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared';
import { SearchComponent } from './search.component';
import { SearchFilterComponent } from './filter/search-filter.component';
import { SearchListComponent } from './list/search-list.component';
import { SearchService } from './shared/search.service';

const searchRouting: ModuleWithProviders = RouterModule.forChild([
	{
		path: 'search/list?:sport&:location&:lat&:long',
		component: SearchListComponent
	}
]);

@NgModule({
	imports: [
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
	]
})
export class SearchModule {}
