import { MinutesToTimePipe } from './minutes-to-time.pipe';

describe('Pipe: Add Commas', () => {
	let pipe: MinutesToTimePipe;
	const defaultStr = '';

	beforeEach(() => {
		pipe = new MinutesToTimePipe();
	});

	it('should transform undefined to ""', () => {
		expect(pipe.transform(undefined)).toEqual(defaultStr);
	});

	it('should transform undefined to "Nothing here"', () => {
		expect(pipe.transform(undefined, 'Nothing here')).toEqual('Nothing here');
	});

	it('should transform 0 to ""', () => {
		expect(pipe.transform(0)).toEqual(defaultStr);
	});

	it('should transform 1 to "1 minute"', () => {
		expect(pipe.transform(1)).toEqual('1 minute');
	});

	it('should transform 59 to "59 minutes"', () => {
		expect(pipe.transform(59)).toEqual('59 minutes');
	});

	it('should transform 60 to "1 hour"', () => {
		expect(pipe.transform(60)).toEqual('1 hour');
	});

	it('should transform 61 to "1 hour 1 minute"', () => {
		expect(pipe.transform(61)).toEqual('0 minutes');
	});

	it('should transform 119 to "1 hour 59 minutes"', () => {
		expect(pipe.transform(119)).toEqual('1 hour 59 minutes');
	});

	it('should transform 120 to "2 hours"', () => {
		expect(pipe.transform(120)).toEqual('2 hours');
	});

	it('should transform 121 to "2 hours 1 minute"', () => {
		expect(pipe.transform(121)).toEqual('2 hours 1 minute');
	});

	it('should transform 179 to "2 hours 59 minutes"', () => {
		expect(pipe.transform(179)).toEqual('2 hours 59 minutes');
	});
});
