import { UppercaseFirstPipe } from './uppercase-first.pipe';

describe('Pipe: Uppercase First', () => {
	let pipe: UppercaseFirstPipe;
	const defaultStr = '';

	beforeEach(() => {
		pipe = new UppercaseFirstPipe();
	});

	it('should transform undefined to ""', () => {
		expect(pipe.transform(undefined)).toEqual(defaultStr);
	});

	it('should transform undefined to "Nothing here"', () => {
		expect(pipe.transform(undefined, 'Nothing here')).toEqual('Nothing here');
	});

	it('should transform "" to ""', () => {
		expect(pipe.transform('')).toEqual('');
	});

	it('should transform "" to "Nothing here"', () => {
		expect(pipe.transform('', 'Nothing here')).toEqual('Nothing here');
	});

	it('should transform "b" to "B"', () => {
		expect(pipe.transform('b')).toEqual('B');
	});

	it('should transform "bob" to "Bob"', () => {
		expect(pipe.transform('bob')).toEqual('Bob');
	});

	it('should transform "i am bob" to "I am bob"', () => {
		expect(pipe.transform('i am bob')).toEqual('I am bob');
	});
});
