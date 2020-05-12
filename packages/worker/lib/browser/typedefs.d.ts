import { Page, RespondOptions } from 'puppeteer';
export declare type PageCallback = (page: Page) => Promise<void>;
export declare type MockHandler = (url: string) => RespondOptions | Promise<RespondOptions>;
export interface Stats {
    pages: Set<string>;
    pageCount: number;
}
