import { Page } from 'puppeteer';
export declare const stripScriptTags: (page: Page) => Promise<void>;
export declare const removeAttribute: (page: Page, tag: string, attr: string) => Promise<void>;
export declare const scrollToBottom: (page: Page, scrollStep?: number, scrollDelay?: number) => Promise<unknown>;
