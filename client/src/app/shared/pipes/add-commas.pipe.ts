import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'addCommas' })
export class AddCommasPipe implements PipeTransform {
	transform(input: null | string[], defaultStr: string = ''): string {
		if (!input) {
			return defaultStr;
		}

		switch (input.length) {
			case 0:
				return defaultStr;
			case 1:
				return input[0];
			case 2:
				return input.join(' and ');
			default:
				const last = input[input.length - 1];
				const remaining = input.slice(0, -1);
				return `${remaining.join(', ')}, and ${last}`;
		}
	}
}
