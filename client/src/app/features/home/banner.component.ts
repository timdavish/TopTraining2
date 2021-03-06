import { Component, Input, OnInit } from '@angular/core';

import { Sport, User } from 'app/shared';

@Component({
	selector: 'home-banner',
	templateUrl: './banner.component.html',
	styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
	showForm: boolean = false;

	constructor() {}

	ngOnInit(): void {}

	goToSearch(): void {
		this.showForm = true;
	}
}
