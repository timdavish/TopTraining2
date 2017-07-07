import { Directive,	Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { UserService } from 'app/core/services/user.service';

@Directive({ selector: '[showAuthed]' })
export class ShowAuthedDirective implements OnDestroy, OnInit {
	condition: boolean;

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private templateRef: TemplateRef<any>,
		private userService: UserService,
		private viewContainer: ViewContainerRef
	) {}

	ngOnInit(): void {
		this.userService.isAuthenticated
			.takeUntil(this.ngUnsubscribe)
			.subscribe(
				isAuthenticated => {
					if (isAuthenticated && this.condition || !isAuthenticated && !this.condition) {
						this.viewContainer.createEmbeddedView(this.templateRef);
					} else {
						this.viewContainer.clear();
					}
				},
				err => {}
			);
	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	@Input() private set showAuthed(condition: boolean) {
		this.condition = condition;
	}
}
