import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sort' })
export class SortPipe implements PipeTransform {
	transform(input: any[], paths: string[] = ['+'], defaultArr: any[] = []): any[] {
		if (!input) {
			return defaultArr;
		}

		if (!Array.isArray(input)) {
			return input;
		}

		if (!paths[0] || paths[0] === '+' || paths[0] === '-') {
			// Basic array, since we were only passed +, -, or nothing
			let asc = paths[0].substring(0, 1) !== '-';
			return asc ? input.sort() : input.sort().reverse();
		} else {
			// Object array, since we were passed at least one property
			return input.sort((a: any, b: any) => {
				for (let i = 0; i < paths.length; i++) {
					let asc = paths[i].substring(0, 1) !== '-';
					let propertyA = paths[i].substring(0, 1) === '-' || paths[i].substring(0, 1) === '+'
						? this.getProperty(a, paths[i].substring(1))
						: this.getProperty(a, paths[i]);
					let propertyB = paths[i].substring(0, 1) === '-' || paths[i].substring(0, 1) === '+'
						? this.getProperty(b, paths[i].substring(1))
						: this.getProperty(b, paths[i]);

					let comparison = asc
						? this.sortComparator(propertyA, propertyB)
						: this.sortComparator(propertyB, propertyA);

					// Don't return 0 yet in case of needing to sort by next property
					if (comparison !== 0) {
						return comparison;
					}
				}

				// Objects were equal on all compared properties
				return 0;
			});
		}
	}

	private getProperty(obj: {[key: string]: any}, key: string): any {
		const keys = key.split(".");
		while (keys.length && (obj = obj[keys.shift()]));
		return obj;
	}

	private sortComparator(a: any, b: any): number {
		if (a === null || typeof a === 'undefined') {
			a = 0;
		}
		if (b === null || typeof b === 'undefined') {
			b = 0;
		}

		if ((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))) {
			// Not comparing numbers, so lowercase to compare properly
			if (a.toLowerCase() < b.toLowerCase()) {
				return -1;
			}
			if (a.toLowerCase() > b.toLowerCase()) {
				return 1;
			}
		} else {
			// Comparing numbers, so parse the strings to compare properly
			if (parseFloat(a) < parseFloat(b)) {
				return -1;
			}
			if (parseFloat(a) > parseFloat(b)) {
				return 1;
			}
		}

		return 0;
	}
}
