export class User {
	// General properties
	usertype: string;
	token: string;
	contact: {
		email: string,
		phone: number,
		firstname: string,
		lastname: string
	};
	accounts: {
		local: {[key: string]: string},
		facebook: {}
	};
	data: {
		createdAt: string,
		activeAt: string
	};
}

export class Admin extends User {
	// Admin properties
	actions: [{
		admin: User,
		createdAt: string,
		message: string
	}];
}

export class Client extends User {
	// Client properties

}

export class Trainer extends User {
	// Trainer properties
	approved: boolean;
	profiles: [{
		sport: string,
		// locations: [{}],
		// packages: [{}],
		summary: string,
		credentials: {
			experience: number,
			school: string
		},
		services: {
			ages: [string],
			positions: [string],
			specialties: [string]
		}
	}];
	rating;
}
