import { SortPipe } from './sort.pipe';

describe('Pipe: Sort', () => {
	let pipe: SortPipe;
	const defaultArr = [];
	const simpleArrUnsorted = [1, 2, 4, 3];
	const simpleArrSorted = [1, 2, 3, 4];
	const objectArrUnsorted = [{ name: 'John' }, { name: 'Bill' }, { name: 'Jones' }];
	const objectArrSorted = [{ name: 'Bill' }, { name: 'John' }, { name: 'Jones' }];
	const complexObjectArrUnsorted = [
		{ name: 'John', grade: 10 }, { name: 'Bill', grade: 10 }, { name: 'Zane', grade: 9 }, { name: 'John', grade: 11 }
	];
	const complexObjectArrSortedAscNameAscGrade = [
		{ name: 'Bill', grade: 10, }, { name: 'John', grade: 10 }, { name: 'John', grade: 11 }, { name: 'Zane', grade: 9 }
	];
	const complexObjectArrSortedAscGradeAscName = [
		{ name: 'Zane', grade: 9 }, { name: 'Bill', grade: 10, }, { name: 'John', grade: 10 }, { name: 'John', grade: 11 }
	];
	const complexObjectArrSortedAscNameDescGrade = [
		{ name: 'Bill', grade: 10, }, { name: 'John', grade: 10 }, { name: 'John', grade: 11 }, { name: 'Zane', grade: 9 }
	];


	beforeEach(() => {
		pipe = new SortPipe();
	});

	it(`should transform undefined to ${defaultArr}`, () => {
		expect(pipe.transform(undefined)).toEqual(defaultArr);
	});

	it(`should transform undefined to ${defaultArr}`, () => {
		expect(pipe.transform(undefined, undefined, defaultArr)).toEqual(defaultArr);
	});

	it(`should transform ${simpleArrUnsorted} to ${simpleArrSorted}`, () => {
		expect(pipe.transform(simpleArrUnsorted)).toEqual(simpleArrSorted);
	});

	it(`should transform ${simpleArrUnsorted} to ${simpleArrSorted}`, () => {
		expect(pipe.transform(simpleArrUnsorted, [])).toEqual(simpleArrSorted);
	});

	it(`should transform ${simpleArrUnsorted} to ${simpleArrSorted}`, () => {
		expect(pipe.transform(simpleArrUnsorted, ['+'])).toEqual(simpleArrSorted);
	});

	it(`should transform ${simpleArrUnsorted} to ${simpleArrSorted.reverse()}`, () => {
		expect(pipe.transform(simpleArrUnsorted, ['-'])).toEqual(simpleArrSorted.reverse());
	});

	it(`should transform ${objectArrUnsorted} to ${objectArrSorted}`, () => {
		expect(pipe.transform(objectArrUnsorted, ['name'])).toEqual(objectArrSorted);
	});

	it(`should transform ${objectArrUnsorted} to ${objectArrSorted}`, () => {
		expect(pipe.transform(objectArrUnsorted, ['+name'])).toEqual(objectArrSorted);
	});

	it(`should transform ${objectArrUnsorted} to ${objectArrSorted.reverse()}`, () => {
		expect(pipe.transform(objectArrUnsorted, ['-name'])).toEqual(objectArrSorted.reverse());
	});

	it(`should transform ${complexObjectArrUnsorted} to ${complexObjectArrSortedAscNameAscGrade}`, () => {
		expect(pipe.transform(complexObjectArrUnsorted, ['name', 'grade'])).toEqual(complexObjectArrSortedAscNameAscGrade);
	});

	it(`should transform ${complexObjectArrUnsorted} to ${complexObjectArrSortedAscGradeAscName}`, () => {
		expect(pipe.transform(complexObjectArrUnsorted, ['grade', 'name'])).toEqual(complexObjectArrSortedAscGradeAscName);
	});

	it(`should transform ${complexObjectArrUnsorted} to ${complexObjectArrSortedAscNameAscGrade.reverse()}`, () => {
		expect(pipe.transform(complexObjectArrUnsorted, ['-name', '-grade'])).toEqual(complexObjectArrSortedAscNameAscGrade.reverse());
	});

	it(`should transform ${complexObjectArrUnsorted} to ${complexObjectArrSortedAscGradeAscName.reverse()}`, () => {
		expect(pipe.transform(complexObjectArrUnsorted, ['-grade', '-name'])).toEqual(complexObjectArrSortedAscGradeAscName.reverse());
	});
});
