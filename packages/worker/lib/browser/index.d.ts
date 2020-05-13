import puppeteer, { Page } from 'puppeteer-core';
import { Settings } from '../typedefs/common';
import { PageCallback, MockHandler } from './typedefs';
declare class CustomBrowser {
    private browser;
    private settings;
    private mockHandler;
    private pages;
    initialize(settings?: Settings): Promise<void>;
    with(func: PageCallback, settings: Settings, currentPage?: Page): Promise<Page>;
    getPageContent(page: Page, link: string, before?: (page: Page) => Promise<void>): Promise<{
        url: string;
        html: string;
    }>;
    newPage(settings?: Settings): Promise<puppeteer.Page>;
    forkPage(page: Page, settings?: Settings): Promise<puppeteer.Page>;
    setMockHandler(handler: MockHandler): void;
    resetMockHandler(): void;
    getActivePages(): Promise<number>;
    cleanup(): Promise<void>;
    getStats(): {
        pages: string[];
        pageCount: number;
    };
}
export default CustomBrowser;
