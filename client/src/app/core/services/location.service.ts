import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

declare const google: any;

interface GeolocationOptions {
	enableHighAccuracy?: boolean;
	maximumAge?: number;
	timeout?: number;
}

interface GeocodeOptions {
	administrativeArea?: string;
	country?: string;
	locality?: string;
	postalCode?: string;
	route?: string;
}

const defaultGeocodeOptions: GeocodeOptions = { country: 'US' };
const errors = {
	'geolocation.unsupportedBrowser': 'Browser does not support location services',
	'geolocation.permissionDenied': 'You have rejected access to your location',
	'geolocation.positionUnavailable': 'Unable to determine your location',
	'geolocation.timeout': 'Service timeout has been reached',
	'parse.noLocation': 'No location was supplied'
};

@Injectable()
export class LocationService {
	private geocoder: any;

	constructor() {
		this.geocoder = new google.maps.Geocoder();
	}

	/**
	 * @namespace getLocation
	 * @desc Obtains the geographic position, in terms of latitude and longitude coordinates, of the device.
	 * @param {GeolocationOptions} [opts] An object literal to specify one or more of the following attributes and desired values:
	 *   - enableHighAccuracy: Specify true to obtain the most accurate position possible, or false to optimize in favor of performance and power consumption.
	 *   - maximumAge: An Integer value indicating the maximum age, in milliseconds, of cached position information.
	 *                 If maximumAge is non-zero, and a cached position that is no older than maximumAge is available, the cached position is used instead of obtaining an updated location.
	 *                 If maximumAge is zero (0), watchPosition always tries to obtain an updated position, even if a cached position is already available.
	 *                 If maximumAge is Infinity, any cached position is used, regardless of its age, and watchPosition only tries to obtain an updated position if no cached position data exists.
	 *   - timeout: An Integer value that indicates the time, in milliseconds, allowed for obtaining the position.
	 *              If timeout is Infinity, (the default value) the location request will not time out.
	 *              If timeout is zero (0) or negative, the results depend on the behavior of the location provider.
	 * @return {Observable} An observable with the geographical location of the device running the client.
	 */
	public getLocation(options: GeolocationOptions = null): Observable<any> {
		return Observable.create(observer => {
			if (window.navigator && window.navigator.geolocation) {
				window.navigator.geolocation.getCurrentPosition(
					position => {
						observer.next(position);
					},
					err => {
						switch (err.code) {
							case 1:
								observer.error(errors['geolocation.permissionDenied']);
								break;
							case 2:
								observer.error(errors['geolocation.positionUnavailable']);
								break;
							case 3:
								observer.error(errors['geolocation.timeout']);
								break;
						}
					},
					options
				)
			} else {
				observer.error(errors['geolocation.unsupportedBrowser']);
			}
		});
	}

	/**
	 * @namespace geocode
	 * @desc Turns an address into a lat/long
	 * @param {String} address The address to geocode
	 * @param {GeocodeOptions} options The component restrictions to use for this geocode
	 * @return {Observable} An observable with lat/long or error
	 */
	public geocode(address: string, options: GeocodeOptions = defaultGeocodeOptions): Observable<any> {
		return Observable.create(observer => {
			if (!!this.geocoder && !!google && address) {
				this.geocoder.geocode({
					'address': address,
					componentRestrictions: options
				}, function (results, status) {
					if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
						const location = results[0]['geometry']['location'];
						const coordinates = {
							lat: location.lat(),
							long: location.lng()
						};
						observer.next(coordinates);
					} else {
						observer.error(status);
					}
				});
			}
		});
	}

	/**
	 * @namespace reverseGeocode
	 * @desc Turns a lat/long into addresses
	 * @param {double} lat Latitude of location to reverse geocode
	 * @param {double} long Longitude of location to reverse geocode
	 * @return {Observable} An observable with geocode results or error
	 */
	public reverseGeocode(lat: number, long: number): Observable<any> {
		return Observable.create(observer => {
			if (!!this.geocoder && !!google && lat && long) {
				const latlng = new google.maps.LatLng(lat, long);

				this.geocoder.geocode({
					'latLng': latlng
				}, function (results, status) {
					if (status === google.maps.GeocoderStatus.OK && results) {
						observer.next(results);
					} else {
						observer.error(status);
					}
				});
			}
		});
	}

	/**
	 * @namespace parseAddressComponents
	 * @desc Turns a lat/long into a formatted address
	 * @param {Array} location The location to parse components from
	 * @return {Observable} An observable with parsed_components or error
	 */
	public parseAddressComponents(location: any): Observable<any> {
		return Observable.create(observer => {
			if (location) {
				var address_components = location.address_components;
				var parsed_components = {};
				address_components.forEach(function(component) {
					component.types.forEach(function(type) {
						parsed_components[type] = component.short_name;
					});
				});
				observer.next(parsed_components);
			} else {
				observer.error(errors['parse.noLocation']);
			}
		});
	}
}
