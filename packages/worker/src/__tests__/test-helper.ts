import { Page } from 'puppeteer'
import Traverser from '../traverse'
import CustomBrowser from '../browser'
import { TraverseOptions, NodeInput, FlowNode } from '../typedefs/node'
import { MockHandler } from '../browser/typedefs'

interface PageMock {
    url?: string
    content: string
}

let traverser: Traverser | undefined
let browser: CustomBrowser | undefined

const getMockedHtml = (content: string) => {
    return `
        <html>
            <head></head>
            <body>${content}</body>
        </html>
    `
}

const DEFAULT_MOCKED_HTML = getMockedHtml('Hello world')

const defaultMockHandler: MockHandler = () => {
    return {
        body: DEFAULT_MOCKED_HTML
    }
}

export const setup = async (
    options: TraverseOptions = { settings: {} },
    mockHandler?: MockHandler
) => {
    browser = new CustomBrowser()

    browser.setMockHandler(mockHandler || defaultMockHandler)

    await browser.initialize(options.settings)

    traverser = new Traverser(options, browser)
    return traverser
}

export const mockPage = (mock: PageMock) => {
    if (!browser) throw new Error('Test browser was not initialized')

    browser.setMockHandler((url: string) => {
        if (mock.url === url) return { body: getMockedHtml(mock.content) }
        return { body: getMockedHtml(mock.content) }
    })
}

export const mockPages = (mocks: PageMock[]) => {
    if (!browser) throw new Error('Test browser was not initialized')

    browser.setMockHandler((url: string) => {
        const mocked = mocks.find(i => i.url === url)
        if (mocked) return { body: getMockedHtml(mocked.content) }
        return { body: DEFAULT_MOCKED_HTML }
    })
}

export const cleanup = async () => {
    if (traverser) await traverser.cleanup()
    traverser = undefined
    browser = undefined
}

export const hasDefaultResult = async (
    input: NodeInput<FlowNode, any, any>
) => {
    if (!input.page) throw new Error("Test result didn't have page")
    const content = await input.page.content()
    return content === DEFAULT_MOCKED_HTML
}

export const hasResult = async (
    input: NodeInput<FlowNode, any, any>,
    result: string
) => {
    if (!input.page) throw new Error("Test result didn't have page")
    const content = await input.page.content()
    return content === getMockedHtml(result)
}

export const initializePage = async (content?: string): Promise<Page> => {
    if (!browser) throw new Error('Test browser was not initialized')

    const page = await browser.newPage({})
    await page.setContent(getMockedHtml(content || DEFAULT_MOCKED_HTML))

    return page
}
