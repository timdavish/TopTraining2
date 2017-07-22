import { PackageOptions } from './package-options.model';

export const PackageOptionsState: PackageOptions = {
	lengths: getLengths(),
	rates: getRates()
};

function getLengths(): number[] {
	let lengths = [];
	for (let i = 30; i <= 90; i += 5) {
		lengths.push(i);
	}
	return lengths;
}

function getRates(): number[] {
	let rates = [];
	for (let i = 10; i <= 100; i += 5) {
		rates.push(i);
	}
	return rates;
}
