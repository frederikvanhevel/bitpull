declare type UrlFunction = (url: string, prop: string) => string;
declare const _default: (html: string, url: string | UrlFunction) => string;
export default _default;
export declare const absolutifyUrl: (url: string, origin: string) => string;
