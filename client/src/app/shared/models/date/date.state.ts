import { Date } from './date.model';

export const DateState: Date = {
	years: getYears(),
	months: getMonths(),
	days: getDays()
};

function getYears(): number[] {
	let years = []
	for (let i = 13; i <= 100; i++) {
		years.push(2017 - i);
	}
	return years;
}

function getMonths(): number[] {
	let months = []
	for (let i = 1; i <= 12; i++) {
		months.push(i);
	}
	return months;
}

function getDays(): number[] {
	let days = [];
	for (let i = 1; i <= 31; i++) {
		days.push(i);
	}
	return days;
}
