import { FilterPipe } from './filter.pipe';

describe('Pipe: Filter', () => {
	let pipe: FilterPipe;
	const defaultArr = [];
	const simpleArrUnfiltered = [2, 5, 1, 4, 3];
	const simpleArrFiltered = [2, 1, 3];
	const objectArrUnfiltered = [{ name: 'John' }, { name: 'Bill' }, { name: 'Jones' }, { name: 'John' }];
	const objectArrFiltered = [{ name: 'John' }, { name: 'John' }];
	const complexObjectArrUnfiltered = [
		{ name: 'John', grade: 10 }, { name: 'Bill', grade: 10 }, { name: 'Zane', grade: 9 }, { name: 'John', grade: 11 }
	];
	const complexObjectArrFilteredGrade = [
		{ name: 'John', grade: 10 }, { name: 'Bill', grade: 10 }, { name: 'Zane', grade: 9 }
	];
	const complexObjectArrFilteredNameGrade = [
		{ name: 'John', grade: 11 }
	];

	beforeEach(() => {
		pipe = new FilterPipe();
	});

	it(`should transform undefined to ${defaultArr}`, () => {
		expect(pipe.transform(undefined)).toEqual(defaultArr);
	});

	it(`should transform undefined to ${defaultArr}`, () => {
		expect(pipe.transform(undefined, undefined, undefined, defaultArr)).toEqual(defaultArr);
	});

	it(`should transform ${simpleArrUnfiltered} to ${simpleArrFiltered}`, () => {
		expect(pipe.transform(simpleArrUnfiltered, ['<'], [4])).toEqual(simpleArrFiltered);
	});

	it(`should transform ${objectArrUnfiltered} to ${objectArrFiltered}`, () => {
		expect(pipe.transform(objectArrUnfiltered, ['=name'], ['john'])).toEqual(objectArrFiltered);
	});

	it(`should transform ${complexObjectArrUnfiltered} to ${complexObjectArrFilteredGrade}`, () => {
		expect(pipe.transform(complexObjectArrUnfiltered, ['<grade'], [11])).toEqual(complexObjectArrFilteredGrade);
	});

	it(`should transform ${complexObjectArrUnfiltered} to ${complexObjectArrFilteredNameGrade}`, () => {
		expect(pipe.transform(complexObjectArrUnfiltered, ['name', '<grade'], ['john', 11])).toEqual(complexObjectArrFilteredNameGrade);
	});
});
