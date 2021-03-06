import { AgeGroup } from '../age-group/age-group.model';

export class User {
	// General properties
	id: string;
	usertype: 'Admin' | 'Client' | 'Trainer' | 'User';
	token: string;
	contact: Contact;
	createdAt: Date;
	updatedAt: Date;

	// Admin properties
	actions?: [Action];

	// Client properties

	// Trainer properties
	completed_app?: boolean;
	profiles?: [TrainerProfile];
	rating?: Rating;
};

// General properties
export class Contact {
	email: string;
	phone: string;
	firstname: string;
	lastname: string;
	gender: string;
	dob: Dob;
	address: Address
};

export class Dob {
	year: number;
	month: number;
	day: number;
};

export class Address {
	street_one: string;
	street_two: string;
	city: string;
	state: string;
	zipcode: number;
};

export class Accounts {
	local: {[key: string]: string};
	facebook: {};
};

// Admin properties
export class Action {
	admin: User;
	createdAt: string;
	message: string;
};

// Client properties


// Trainer properties
export class TrainerProfile {
	id?: string;
	sport: string;
	completed: boolean;
	approved: boolean;
	image: string;
	locations: [Location];
	packages: [Package];
	summary: string;
	credentials: Credentials = new Credentials();
	services: Services = new Services();
}

export class Location {
	priority: number;
	formatted_address: string;
	geometry: Geometry;
};

export class Package {
	type: string;
	sessions: number;
	length: number;
	price: number;
};

export class Credentials {
	experience: string;
	school: string;
};

export class Services {
	ages: [AgeGroup];
	positions: string;
	specialties: string;
};

export class Geometry {
	type: string;
	coordinates: Array<number>;
};

export class Rating {
	average: number;
	count: number;
	reviews: [Review];
};

export class Review {
	author: string;
	rating: number;
	date: string;
	type: string;
	content: string;
}
