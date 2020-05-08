export declare const delay: (duration: number) => Promise<void>;
export declare const randomizedDelay: (minDuration?: number, maxDuration?: number) => Promise<void>;
export declare function retryBackoff<T>(fn: Function, retries: number, delayTime?: number): Promise<T>;
