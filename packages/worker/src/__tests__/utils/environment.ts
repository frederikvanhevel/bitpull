import { Page } from 'puppeteer'
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

const defaultMockHandler: MockHandler = () => {
    return {
        body: DEFAULT_MOCKED_HTML
    }
}

export class TestEnvironment {
    private traverser: Traverser | undefined
    private browser: CustomBrowser | undefined

    async setup(
        options: TraverseOptions = { settings: {} },
        mockHandler?: MockHandler
    ) {
        this.browser = new CustomBrowser()

        this.browser.setMockHandler(mockHandler || defaultMockHandler)

        await this.browser.initialize(options.settings)

        this.traverser = new Traverser(options, this.browser)
    }

    mockPage(mock: PageMock) {
        if (!this.browser) throw new Error('Test browser was not initialized')

        this.browser.setMockHandler((url: string) => {
            if (mock.url === url) return { body: getMockedHtml(mock.content) }
            return { body: getMockedHtml(mock.content) }
        })
    }

    mockPages(mocks: PageMock[]) {
        if (!this.browser) throw new Error('Test browser was not initialized')

        this.browser.setMockHandler((url: string) => {
            const mocked = mocks.find(i => i.url === url)
            if (mocked) return { body: getMockedHtml(mocked.content) }
            return { body: DEFAULT_MOCKED_HTML }
        })
    }

    async cleanup() {
        if (this.traverser) await this.traverser.cleanup()
        this.traverser = undefined
        this.browser = undefined
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
