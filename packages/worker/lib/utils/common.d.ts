export declare const request: (url: string, retries?: number) => Promise<any>;
export declare const getUriOrigin: (uri: string) => string;
export declare function assert(condition: any, errorCode?: string): asserts condition;
export declare const isTestEnv: () => boolean;
export declare const clamp: (number: number, min: number, max: number) => number;
