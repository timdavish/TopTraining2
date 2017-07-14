import { User } from './user.model';

export class Sport {
	constructor(
		public sport?: string,
		public trainers?: Array<User>
	) {}
}
