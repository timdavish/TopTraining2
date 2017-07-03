import { Injectable } from '@angular/core';

@Injectable()
export class JwtService {
	private readonly tokenName: string = 'TTToken';

	public getToken(): String {
		return window.localStorage[this.tokenName];
	}

	public saveToken(token: String) {
		window.localStorage[this.tokenName] = token;
	}

	public destroyToken(): void {
		window.localStorage.removeItem(this.tokenName);
	}

}
