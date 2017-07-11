import { Directive, ElementRef, EventEmitter, OnInit, Output } from '@angular/core';

import { MapsAPILoader } from '@agm/core';

declare const google: any;

@Directive({
	selector: 'input[locationAutocomplete]'
})
export class LocationAutocompleteDirective implements OnInit {
	private readonly options: any = { componentRestrictions: { country: 'US' } };

	private autocomplete: any;
	private input: any;

	constructor(
		private elementRef: ElementRef,
		private loader: MapsAPILoader,
	) {}

	ngOnInit(): void {
		this.loader.load().then(() => {
			this.input = this.elementRef.nativeElement;

			this.autocomplete = new google.maps.places.Autocomplete(this.input, this.options);

			google.maps.event.addListener(this.autocomplete, 'place_changed', () => {
				const place = this.autocomplete.getPlace();
				this.invokeEvent(place);
			});
		});
	}

	@Output() setAddress: EventEmitter<any> = new EventEmitter();

	invokeEvent(place: Object) {
		this.setAddress.emit(place);
	}
}
