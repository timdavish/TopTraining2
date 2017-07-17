import { AddCommasPipe } from './add-commas.pipe';

describe('Pipe: Add Commas', () => {
	let pipe: AddCommasPipe;
	const defaultStr = '';

	beforeEach(() => {
		pipe = new AddCommasPipe();
	});

	it('transforms undefined to ""', () => {
		expect(pipe.transform(undefined)).toEqual(defaultStr);
	});

	it('transforms undefined to "None added yet"', () => {
		expect(pipe.transform(undefined, 'None added yet')).toEqual('None added yet');
	});

	it('transforms [] to ""', () => {
		expect(pipe.transform([])).toEqual(defaultStr);
	});

	it('transforms [] to "None added yet"', () => {
		expect(pipe.transform([], 'None added yet')).toEqual('None added yet');
	});

	it('should transform ["Rick"] to "Rick"', () => {
		expect(pipe.transform(['Rick'])).toEqual('Rick');
	});

	it('should transform ["Jeremy", "Andrew"] to "Jeremy and Andrew"', () => {
		expect(pipe.transform(['Jeremy', 'Andrew'])).toEqual('Jeremy and Andrew');
	});

	it('should transform ["Kim", "Ryan", "Amanda"] to "Kim, Ryan, Amanda"', () => {
		expect(pipe.transform(['Kim', 'Ryan', 'Amanda'])).toEqual('Kim, Ryan, and Amanda');
	});
});
