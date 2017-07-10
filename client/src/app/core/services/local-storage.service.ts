import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

export interface LocalStorageEvent {
    key: string;
    newvalue?: any;
    storageType: string;
}

export interface NotifyOptions {
    setItem?: boolean;
    removeItem?: boolean;
}

export interface LocalStorageServiceConfig {
    notifyOptions?: NotifyOptions;
    prefix?: string;
    storageType?: 'sessionStorage' | 'localStorage';
}

const options: LocalStorageServiceConfig = { notifyOptions: null, prefix: 'toptraining', storageType: 'localStorage' };
const deprecated: string = 'This function is deprecated.';
const localStorageNotSupported: string = 'LOCAL_STORAGE_NOT_SUPPORTED';

@Injectable()
export class LocalStorageService {
    public isSupported: boolean = false;

    public errors$: Observable<string>;
    public removeItems$: Observable<LocalStorageEvent>;
    public setItems$: Observable<LocalStorageEvent>;
    public warnings$: Observable<string>;

    private notifyOptions: NotifyOptions = {
        setItem: false,
        removeItem: false
    };
    private prefix: string = 'ls';
    private storageType: 'sessionStorage' | 'localStorage' = 'localStorage';
    private webStorage: Storage;

    private errors: Subscriber<string> = new Subscriber<string>();
    private removeItems: Subscriber<LocalStorageEvent> = new Subscriber<LocalStorageEvent>() ;
    private setItems: Subscriber<LocalStorageEvent> = new Subscriber<LocalStorageEvent>();
    private warnings: Subscriber<string> = new Subscriber<string>();

    constructor() {
		let { notifyOptions, prefix, storageType } = options;

        if (notifyOptions != null) {
            let { setItem, removeItem } = notifyOptions;
            this.setNotify(!!setItem, !!removeItem);
        }
        if (prefix != null) {
            this.setPrefix(prefix);
        }
        if (storageType != null) {
            this.setStorageType(storageType);
        }

        this.errors$ = new Observable<string>((observer: Subscriber<string>) => this.errors = observer).share();
        this.removeItems$ = new Observable<LocalStorageEvent>((observer: Subscriber<LocalStorageEvent>) => this.removeItems = observer).share();
        this.setItems$ = new Observable<LocalStorageEvent>((observer: Subscriber<LocalStorageEvent>) => this.setItems = observer).share();
        this.warnings$ = new Observable<string>((observer: Subscriber<string>) => this.warnings = observer).share();

        this.isSupported = this.checkSupport();
	}

    public add(key: string, value: any): boolean {
        if (console && console.warn) {
            console.warn(deprecated);
            console.warn('Use `LocalStorageService.set` instead.');
        }

        return this.set(key, value);
    }

    public clearAll(regularExpression?: string): boolean {
        // Setting both regular expressions independently
        // Empty strings result in catchall RegExp
        let prefixRegex = !!this.prefix ? new RegExp('^' + this.prefix) : new RegExp('');
        let testRegex = !!regularExpression ? new RegExp(regularExpression) : new RegExp('');

        if (!this.isSupported) {
            this.warnings.next(localStorageNotSupported);
            return false;
        }

        let prefixLength = this.prefix.length;

        for (let key in this.webStorage) {
            // Only remove items that are for this app and match the regular expression
            if (prefixRegex.test(key) && testRegex.test(key.substr(prefixLength))) {
                try {
                    this.remove(key.substr(prefixLength));
                } catch (e) {
                    this.errors.next(e.message);
                    return false;
                }
            }
        }
        return true;
    }

    public deriveKey(key: string): string {
        return `${this.prefix}${key}`;
    }

    public get <T>(key: string): T {
        if (!this.isSupported) {
            this.warnings.next(localStorageNotSupported);
            return null;
        }

        let item = this.webStorage ? this.webStorage.getItem(this.deriveKey(key)) : null;
		console.log('Got', item);
		console.log('In key', this.deriveKey(key));
        // FIXME: not a perfect solution, since a valid 'null' string can't be stored
        if (!item || item === 'null') {
            return null;
        }

        try {
            return JSON.parse(item);
        } catch (e) {
            return null;
        }
    }

    public getStorageType(): string {
        return this.storageType;
    }

    public keys(): Array<string> {
        if (!this.isSupported) {
            this.warnings.next(localStorageNotSupported);
            return [];
        }

        let prefixLength = this.prefix.length;
        let keys: Array<string> = [];
        for (let key in this.webStorage) {
            // Only return keys that are for this app
            if (key.substr(0, prefixLength) === this.prefix) {
                try {
                    keys.push(key.substr(prefixLength));
                } catch (e) {
                    this.errors.next(e.message);
                    return [];
                }
            }
        }
        return keys;
    }

    public length(): number {
        let count = 0;
        let storage = this.webStorage;
        for(let i = 0; i < storage.length; i++) {
            if (storage.key(i).indexOf(this.prefix) === 0) {
                count += 1;
            }
        }
        return count;
    }

    public remove(...keys: Array<string>): boolean {
        let result = true;
        keys.forEach((key: string) => {
            if (!this.isSupported) {
                this.warnings.next(localStorageNotSupported);
                result = false;
            }

            try {
                this.webStorage.removeItem(this.deriveKey(key));
                if (this.notifyOptions.removeItem) {
                    this.removeItems.next({
                        key: key,
                        storageType: this.storageType
                    });
                }
            } catch (e) {
                this.errors.next(e.message);
                result = false;
            }
        });
        return result;
    }

    public set(key: string, value: any): boolean {
        // Let's convert `undefined` values to `null` to get the value consistent
        if (value === undefined) {
            value = null;
        } else {
            value = JSON.stringify(value);
        }

        if (!this.isSupported) {
            this.warnings.next(localStorageNotSupported);
            return false;
        }

        try {
            if (this.webStorage) {
				console.log('Setting', value);
				console.log('In key', this.deriveKey(key));
                this.webStorage.setItem(this.deriveKey(key), value);
            }
            if (this.notifyOptions.setItem) {
                this.setItems.next({
                    key: key,
                    newvalue: value,
                    storageType: this.storageType
                });
            }
        } catch (e) {
            this.errors.next(e.message);
            return false;
        }
        return true;
    }

    private checkSupport(): boolean {
        try {
            let supported = this.storageType in window
                          && window[this.storageType] !== null;

            if (supported) {
                this.webStorage = window[this.storageType];

                // When Safari (OS X or iOS) is in private browsing mode, it
                // appears as though localStorage is available, but trying to
                // call .setItem throws an exception.
                //
                // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made
                // to add something to storage that exceeded the quota."
                let key = this.deriveKey(`__${Math.round(Math.random() * 1e7)}`);
                this.webStorage.setItem(key, '');
                this.webStorage.removeItem(key);
            }

            return supported;
        } catch (e) {
            this.errors.next(e.message);
            return false;
        }
    }

    private setPrefix(prefix: string): void {
        this.prefix = prefix;

        // If there is a prefix set in the config let's use that with an appended
        // period for readability:
        const PERIOD: string = '.';
        if (this.prefix && !this.prefix.endsWith(PERIOD)) {
            this.prefix = !!this.prefix ? `${this.prefix}${PERIOD}` : '';
        }
    }

    private setStorageType(storageType: 'sessionStorage' | 'localStorage'): void {
        this.storageType = storageType;
    }

    private setNotify(setItem: boolean, removeItem: boolean): void {
        if (setItem != null) {
            this.notifyOptions.setItem = setItem;
        }
        if (removeItem != null) {
            this.notifyOptions.removeItem = removeItem;
        }
    }
}
