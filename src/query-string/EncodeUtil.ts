import { encode } from './Encode';
import { decode } from './Decode';

export function getQueryString(url: string) {
    const index = url.indexOf('?');
    if (index >= 0) {
        return url.substring(index + 1);
    } else {
        return '';
    }
}

export function updateUrlStringObject<T extends Record<string, unknown>>(url: string, obj: T): string {
    const index = url.indexOf('?');
    const base = url.substring(0, index);
    const urlQuery = url.substring(index + 1);
    const data = decode(urlQuery);
    const merged = { ...data, ...obj };
    return `${base}?${encode(merged)}`;
}
