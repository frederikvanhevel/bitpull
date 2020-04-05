import { Page, RespondOptions } from 'puppeteer'

export type PageCallback = (page: Page) => Promise<void>

export type MockHandler = (
    url: string
) => RespondOptions | Promise<RespondOptions>
