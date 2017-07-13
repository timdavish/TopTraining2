export class Application {
	sport?: string;
	phone?: string;
	dob_year?: number;
	dob_month?: number;
	dob_day?: number;
	gender?: string;

	address_street_one?: string;
	address_street_two?: string;
	address_city?: string;
	address_state?: string;
	address_zipcode?: number;

	summary?: string;
	experience?: string;
	school?: string;

	ages_adults?: boolean;
	ages_kids?: boolean;
	ages_teenagers?: boolean;
	positions?: string;
	specialties?: string;

	session_length?: number;
	session_rate?: number;
	session_type_private?: boolean;
	session_type_small?: boolean;
	session_type_large?: boolean;

	locations?;
}
