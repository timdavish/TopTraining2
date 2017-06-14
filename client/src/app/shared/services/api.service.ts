import { Injectable } from '@angular/core';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { JwtService } from './jwt.service';
// import { environment } from './../../../environments/environment';
const environment = {
	api_url: ''
};

@Injectable()
export class ApiService {
	constructor(
		private http: Http,
		private jwtService: JwtService
	) {}

	public get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
		return this.http.get(`${environment.api_url}${path}`, { headers: this.setHeaders(), search: params })
			.catch(this.formatErrors)
			.map((res: Response) => res.json());
	}

	public put(path: string, body: Object = {}): Observable<any> {
		return this.http.put(`${environment.api_url}${path}`, JSON.stringify(body), { headers: this.setHeaders() })
			.catch(this.formatErrors)
			.map((res: Response) => res.json());
	}

	public post(path: string, body: Object = {}): Observable<any> {
		return this.http.post(`${environment.api_url}${path}`, JSON.stringify(body), { headers: this.setHeaders() })
			.catch(this.formatErrors)
			.map((res: Response) => res.json());
	}

	public delete(path: string): Observable<any> {
		return this.http.delete(`${environment.api_url}${path}`, { headers: this.setHeaders() })
			.catch(this.formatErrors)
			.map((res: Response) => res.json());
	}

	private setHeaders(): Headers {
		const headersConfig = {
			'Content-Type': 'application/json',
			'Accept': 'application/json'
		};

		if (this.jwtService.getToken()) {
			headersConfig['Authorization'] = `Token ${this.jwtService.getToken()}`;
		}

		return new Headers(headersConfig);
	}

	private formatErrors(error: any) {
		return Observable.throw(error.json());
	}
}
