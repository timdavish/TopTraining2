import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'minutesToTime' })
export class MinutesToTimePipe implements PipeTransform {
	transform(input: null | number, defaultStr: string = ''): string {
		if (!input) {
			return defaultStr;
		}

		const minutes = Math.floor(input % 60);
		const hours = Math.floor(input / 60);

		let hourSegment;
		if (hours > 0) {
			hourSegment = hours + (hours > 1 ? ' hours' : ' hour');
		}

		let minuteSegment;
		if (minutes > 0) {
			if (hourSegment) { hourSegment += ' '; }
			minuteSegment = minutes + (minutes > 1 ? ' minutes' : ' minute');
		}

		return (hourSegment ? hourSegment : '') + (minuteSegment ? minuteSegment : '');
	}
}
