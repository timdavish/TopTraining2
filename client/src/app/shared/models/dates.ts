export class Dates {
	public static years = (() => {
		let years = [];
		const today = 2017;
		for (let i = 13; i <= 100; i++) {
			years.push(today - i);
		}
		return years;
	})();
	public static months = [
		{ value: 1, month: 'January' },
		{ value: 2, month: 'February' },
		{ value: 3, month: 'March' },
		{ value: 4, month: 'April' },
		{ value: 5, month: 'May' },
		{ value: 6, month: 'June' },
		{ value: 7, month: 'July' },
		{ value: 8, month: 'August' },
		{ value: 9, month: 'September' },
		{ value: 10, month: 'October' },
		{ value: 11, month: 'November' },
		{ value: 12, month: 'December' },
	];
	public static days = (() => {
		let days = [];
		for (let i = 1; i <= 31; i++) {
			days.push(i);
		}
		return days;
	})();
}
