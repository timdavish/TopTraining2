import { AfterViewInit, Directive, ElementRef, EventEmitter, Output } from '@angular/core';
import { NgModel } from '@angular/forms';

declare let google: any;

@Directive({
	selector: '[locationAutocomplete]',
	providers: [NgModel],
	host: { '(input)': 'onInputChange()' }
})
export class LocationAutocompleteDirective implements AfterViewInit {
	private autocomplete: any;
	private input: any;
	private options: any = { componentRestrictions: { country: 'US' } };
	modelValue: any;

	constructor(
		private elementRef: ElementRef,
		private model: NgModel
	) {}

	ngAfterViewInit(): void {
		this.input = this.elementRef.nativeElement;
		this.modelValue = this.model;

		this.autocomplete = new google.maps.places.Autocomplete(this.input, this.options);

		google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
			const place = this.autocomplete.getPlace();
			this.invokeEvent(place);
		});
	}

	@Output() setAddress: EventEmitter<any> = new EventEmitter();

	invokeEvent(place: Object) {
		this.setAddress.emit(place);
	}

	onInputChange() {}
}
