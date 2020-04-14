declare type UrlFunction = (url: string, prop: string) => string;
declare const absolutify: (html: string, url: string | UrlFunction) => string;
export declare const absolutifyUrl: (url: string, origin: string) => string;
export declare const absolutifyHtml: (html: string, url: string, proxyEndpoint?: string) => string;
export default absolutify;
