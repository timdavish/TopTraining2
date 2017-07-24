import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ellipsis' })
export class EllipsisPipe implements PipeTransform {
	transform(input: string, length: number = 250, defaultStr: string = ''): string {
		if (!input) {
			return defaultStr;
		}

		const withoutHtml = input.replace(/(<([^>]+)>)/ig, '');

		if (input.length >= length) {
			return `${withoutHtml.slice(0, length)}...`;
		}

		return withoutHtml;
	}
}
