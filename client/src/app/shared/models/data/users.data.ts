import { User } from '../';

const trainer: User = {
	usertype: 'Trainer',
	token: 'token',
	contact: {
		email: 'bob@asdf.com',
		phone: 4254254252,
		firstname: 'Bob',
		lastname: 'Builder',
	},
	accounts: {
		local: {
			hash: 'assdfjjgwovnwowerrotowjjs',
			salt: 'fjwoooenvkkauwjaksjdf'
		},
		facebook: {}
	},
	data: {
		createdAt: 'date()',
		activeAt: 'date()'
	},

	approved: true,
	profiles: [
		{
			sport: 'basketball',

			// locations: [{}],
			// packages: [{}],

			summary: 'Summary',
			credentials: {
				experience: 5,
				school: 'UW'
			},
			services: {
				ages: ['Middle School', 'High School'],
				positions: ['Guard', 'Etc.'],
				specialties: ['Shooting', 'Defense', 'Dribbling']
			}
		}
	],
	rating: {
		average: 4.5,
		count: 2,
		reviews: [
			{
				author: 'Billy Jones',
				rating: 5,
				createdAt: 'date()',
				type: 'Client',
				content: 'Great trainer'
			},
			{
				author: 'Pizza Gale',
				rating: 4,
				createdAt: 'date()',
				type: 'Client',
				content: 'Pretty good trainer'
			}
		]
	}
};
