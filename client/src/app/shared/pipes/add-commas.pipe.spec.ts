import { AddCommasPipe } from './add-commas.pipe';

describe('Pipe: Add Commas', () => {
	let pipe: AddCommasPipe;
	const defaultStr = '';

	beforeEach(() => {
		pipe = new AddCommasPipe();
	});

	it('should transform undefined to ""', () => {
		expect(pipe.transform(undefined)).toEqual(defaultStr);
	});

	it('should transform undefined to "Nothing here"', () => {
		expect(pipe.transform(undefined, 'Nothing here')).toEqual('Nothing here');
	});

	it('should transform [] to ""', () => {
		expect(pipe.transform([])).toEqual(defaultStr);
	});

	it('should transform [] to "Nothing here"', () => {
		expect(pipe.transform([], 'Nothing here')).toEqual('Nothing here');
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
