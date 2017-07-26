import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filter' })
export class FilterPipe implements PipeTransform {
	transform(input: any[], paths: string[] = [], config: any[] = [], defaultArr: any[] = []): any[] {
		if (!input) {
			return defaultArr;
		}

		if (!Array.isArray(input) || paths.length !== config.length) {
			return input;
		}

		if (!paths[0] || paths[0] === '<' || paths[0] === '>' || paths[0] === '=') {
			// Basic array, since we were only passed <, >, =, or nothing
			let compareOp = (paths[0].substring(0, 1) === '<' || paths[0].substring(0, 1) === '>')
				? paths[0].substring(0, 1)
				: '=';
			return input.filter(val => { return this.filterComparator(val, config[0], compareOp); });
		} else {
			// Object array, since we were passed at least one property
			return input.filter(obj => {
				for (let i = 0; i < paths.length; i++) {
					if (config[i] === null) {
						continue;
					}
					let compareOp = (paths[i].substring(0, 1) === '<' || paths[i].substring(0, 1) === '>')
						? paths[i].substring(0, 1)
						: '=';
					let property = paths[i].substring(0, 1) === '<' || paths[i].substring(0, 1) === '>' || paths[i].substring(0, 1) === '='
						? this.getProperty(obj, paths[i].substring(1))
						: this.getProperty(obj, paths[i]);

					if (!this.filterComparator(property, config[i], compareOp)) {
						return false;
					}
				}

				// Object passed the filters on all paths
				return true;
			});
		}
	}

	private getProperty(obj: {[key: string]: any}, key: string): any {
		const keys = key.split(".");
		while (keys.length && (obj = obj[keys.shift()]));
		return obj;
	}

	private filterComparator(a: any, b: any, compareOp: string): boolean {
		if (a === null || typeof a === 'undefined') {
			return true;
		}
		if (b === null || typeof b === 'undefined') {
			return true;
		}

		if ((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))) {
			// Not comparing numbers, so lowercase to compare properly
			if (compareOp === '<') {
				return a.toLowerCase() < b.toLowerCase();
			} else if (compareOp === '>') {
				return a.toLowerCase() > b.toLowerCase();
			} else {
				return a.toLowerCase() === b.toLowerCase();
			}
		} else {
			// Comparing numbers, so parse the strings to compare properly
			if (compareOp === '<') {
				return parseFloat(a) < parseFloat(b);
			} else if (compareOp === '>') {
				return parseFloat(a) > parseFloat(b);
			} else {
				return parseFloat(a) === parseFloat(b);
			}
		}
	}
}
