export declare const ErrorMessages: Record<string, string>;
export declare class FlowError extends Error {
    code: string;
    constructor(code: string);
}
