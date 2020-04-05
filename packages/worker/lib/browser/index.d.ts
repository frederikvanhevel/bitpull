import { Page } from 'puppeteer-core';
import { Settings } from '../typedefs/common';
import { PageCallback, MockHandler } from './typedefs';
declare class CustomBrowser {
    private browser;
    private settings;
    private mockHandler;
    initialize(settings?: Settings): Promise<void>;
    with(func: PageCallback, settings: Settings): Promise<void>;
    getPageContent(page: Page, link: string, delay?: number, waitForNavigation?: boolean): Promise<{
        url: string;
        html: string;
    }>;
    setMockHandler(handler: MockHandler): void;
    resetMockHandler(): void;
    cleanup(): Promise<void>;
}
export default CustomBrowser;
