import { Page } from 'puppeteer'
import merge from 'deepmerge'
import Traverser from '../../traverse'
import CustomBrowser from '../../browser'
import { TraverseOptions, NodeInput, FlowNode } from '../../typedefs/node'
import { MockHandler } from '../../browser/typedefs'

interface PageMock {
    url?: string
    content: string
}

const getMockedHtml = (content: string) => {
    return `
        <html>
            <head></head>
            <body>${content}</body>
        </html>
    `
}

const DEFAULT_MOCKED_HTML = getMockedHtml('Hello world')
const NOT_FOUND_MOCK = { body: '404', status: 404 }

const defaultMockHandler: MockHandler = () => {
    return {
        body: DEFAULT_MOCKED_HTML
    }
}

const DEFAULT_TRAVERSER_OPTIONS = {
    settings: {
        exitOnError: true
    }
}

export class TestEnvironment {
    private traverser: Traverser | undefined
    private browser: CustomBrowser | undefined

    async setup(
        options: Partial<TraverseOptions> = {},
        mockHandler?: MockHandler
    ) {
        this.browser = new CustomBrowser()

        this.browser.setMockHandler(mockHandler || defaultMockHandler)

        await this.browser.initialize(options.settings)

        const mergedOptions = merge(DEFAULT_TRAVERSER_OPTIONS, options)
        this.traverser = new Traverser(mergedOptions, this.browser)
    }

    mockDefault(mock: PageMock) {
        if (!this.browser) throw new Error('Test browser was not initialized')

        this.browser.setMockHandler(() => {
            return { body: getMockedHtml(mock.content) }
        })
    }

    mockPage(mock: PageMock) {
        if (!this.browser) throw new Error('Test browser was not initialized')

        this.browser.setMockHandler((url: string) => {
            if (mock.url === url) return { body: getMockedHtml(mock.content) }
            console.warn(`No mock found for ${url}`)
            return NOT_FOUND_MOCK
        })
    }

    mockPages(mocks: PageMock[]) {
        if (!this.browser) throw new Error('Test browser was not initialized')

        this.browser.setMockHandler((url: string) => {
            const mocked = mocks.find(i => i.url === url)
            if (mocked) return { body: getMockedHtml(mocked.content) }
            console.warn(`No mock found for ${url}`)
            return NOT_FOUND_MOCK
        })
    }

    async cleanup() {
        if (this.traverser) await this.traverser.cleanup()
        this.traverser = undefined
        this.browser = undefined
    }

    async activePages() {
        if (!this.browser) throw new Error('Test browser was not initialized')
        return await this.browser.getActivePages()
    }

    async initializePage(content?: string): Promise<Page> {
        if (!this.browser) throw new Error('Test browser was not initialized')

        const page = await this.browser.newPage({})
        await page.setContent(getMockedHtml(content || DEFAULT_MOCKED_HTML))

        return page
    }

    async parseNode(input: NodeInput<FlowNode>) {
        return this.traverser!.parseNode(input)
    }

    async run(node: FlowNode) {
        return this.traverser!.run(node)
    }

    setOptions(options: Partial<TraverseOptions>) {
        if (!this.traverser) {
            throw new Error('Test traverser was not initialized')
        }

        const mergedOptions = merge(DEFAULT_TRAVERSER_OPTIONS, options)
        this.traverser.setOptions(mergedOptions)
    }

    getBrowserStats = () => {
        if (!this.browser) throw new Error('Test browser was not initialized')

        return this.browser.getStats()
    }
}

export const hasDefaultResult = async (
    input: NodeInput<FlowNode, any, any>
) => {
    if (!input.page) throw new Error("Test result didn't have page")
    const content = await input.page.content()
    return content.replace(/\s/g, '') === DEFAULT_MOCKED_HTML.replace(/\s/g, '')
}

export const htmlHasResult = (html: string, result: string) => {
    return (
        html.replace(/\s/g, '') === getMockedHtml(result).replace(/\s/g, '')
    )
}

export const hasResult = async (
    input: NodeInput<FlowNode, any, any>,
    result: string
) => {
    if (!input.page) throw new Error("Test result didn't have page")
    const content = await input.page.content()
    return (
        content.replace(/\s/g, '') === getMockedHtml(result).replace(/\s/g, '')
    )
}

export const containsResult = async (
    input: NodeInput<FlowNode, any, any>,
    result: string
) => {
    if (!input.page) throw new Error("Test result didn't have page")
    const content = await input.page.content()
    return content.replace(/\s/g, '').includes(result)
}
