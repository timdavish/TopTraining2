export class User {
	token: string;
	contact: Contact;
	accounts: Accounts;
	data: Data;
}

export class Admin extends User {
	actions: [Action]
}

export class Client extends User {}

export class Trainer extends User {}

interface Contact {
	email: string,
	phone: number,
	firstname: string,
	lastname: string
}

interface Accounts {
	local: {[key: string]: string},
	facebook: {}
}

interface Data {
	createdAt: string,
	activeAt: string
}

interface Action {
	admin: object,
	date: string,
	message: string
}
