import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'uppercaseFirst' })
export class UppercaseFirstPipe implements PipeTransform {
	transform(input: string, defaultStr: string = ''): string {
		if (!input) {
			return defaultStr;
		}

		return input.charAt(0).toUpperCase() + input.slice(1);
	}
}
