import { Component, OnDestroy, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { Application } from '../shared/application.model';
import { ApplicationService } from '../shared/application.service';
import { UserService } from 'app/core/services';
import { Errors, Location, Sport, TrainerProfile, User } from 'app/shared';

declare const google: any;

@Component({
	selector: 'application-availability',
	templateUrl: './application-availability.component.html',
	styleUrls: ['./application-availability.component.css']
})
export class ApplicationAvailabilityComponent implements OnDestroy, OnInit {
	private readonly maxLocations = 4;

	application: Application;
	errors: Errors = new Errors();
	isSubmitting: boolean = false;
	latitude: number;
	longitude: number;
	location: object;
	locations: Location[] = [];
	zoom: number;

	private ngUnsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private applicationService: ApplicationService,
		private router: Router,
		private userService: UserService
	) {}

	ngOnInit(): void {
		// Get our profile from localStorage, otherwise the application is
		// compromised and we need to restart
		this.application = this.applicationService.retrieveApplication();

		// Set map defaults
		this.latitude = 40;
		this.longitude = -95.7129;
		this.zoom = 4

		// Try to get current browser location to set a new center
	}

	ngOnDestroy(): void {
		// Clean up subscriptions
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	public addLocation(): void {
		if (this.locations.length >= this.maxLocations) {
			return;
		}

		if (this.location != null) {
			const priority = this.locations.length + 1;
			const formatted_address = this.location['formatted_address'];
			const geometry = this.location['geometry']['location'];
			const lat = geometry.lat();
			const long = geometry.lng();

			const location: Location = {
				priority: priority,
				formatted_address: formatted_address,
				geometry: {
					type: "Point",
					coordinates: [long, lat]
				}
			};
			this.locations.push(location);

			// Focus our map on this point
			this.latitude = lat;
			this.longitude = long;
			this.zoom = 12;

			this.location = null;
		}
	}

	public removeLocation(index: number): void {
		this.locations.splice(index, 1);
		for (let i = index; i < this.locations.length; i++) this.locations[i].priority = i + 1;
	}

	public setLocation(place: Object): void {
		this.location = place;
    }

	public submitForm(): void {
		this.errors = new Errors();
		this.isSubmitting = true;

		// Update the stored model
		this.updateApplication(this.locations);
		this.applicationService.submitApplication(this.application)

		this.router.navigateByUrl('/');
		// this.router.navigateByUrl('/trainer_app/complete/');
	}

	private updateApplication(values: Object): void {
		this.application.locations = values;
	}
}
