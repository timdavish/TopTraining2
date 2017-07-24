import { User } from './user.model';

export const userState: User = {
	id: 'id',
	usertype: 'User',
	token: 'token',
	contact: {
		email: 'bob@asdf.com',
		phone: '4254254252',
		firstname: 'Bob',
		lastname: 'Builder',
		gender: 'male',
		dob: {
			year: 2017,
			month: 1,
			day: 1
		},
		address: {
			street_one: '1234 address st',
			street_two: '',
			city: 'City',
			state: 'State',
			zipcode: 12345
		}
	},
	createdAt: new Date(),
	updatedAt: new Date()
};
