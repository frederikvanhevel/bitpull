import puppeteer, {
    Browser,
    Page,
    ConnectOptions,
    LaunchOptions
} from 'puppeteer-core'
import UserAgent from 'user-agents'
import chromium from 'chrome-aws-lambda'
import treekill from 'tree-kill'
import { Settings } from '../typedefs/common'
import { isTestEnv } from '../utils/common'
import { stripScriptTags, removeAttribute } from '../utils/scripts'
import { PageCallback, MockHandler } from './typedefs'

const DEFAULT_OPTIONS: ConnectOptions | LaunchOptions = {
    defaultViewport: {
        width: 1920,
        height: 1080
    },
    slowMo: 10,
    headless: true
}

const getPuppeteerArgs = (settings: Settings) => {
    const { puppeteer } = settings
    const args = puppeteer?.endpoint ? [] : chromium.args

    return [
        ...args,
        ...(puppeteer?.proxy ? [`--proxy-server=${puppeteer.proxy}`] : [])
    ]
}

class CustomBrowser {
    private browser: Browser | undefined
    private settings: Settings = {}
    private mockHandler: MockHandler | undefined

    async initialize(settings: Settings = {}) {
        this.settings = settings

        try {
            if (settings.puppeteer?.endpoint) {
                this.browser = await puppeteer.connect({
                    browserWSEndpoint: settings.puppeteer.endpoint,
                    ignoreHTTPSErrors: true,
                    ...getPuppeteerArgs(settings),
                    ...DEFAULT_OPTIONS
                })
            } else {
                this.browser = await chromium.puppeteer.launch({
                    executablePath: await chromium.executablePath,
                    ...getPuppeteerArgs(settings),
                    ...DEFAULT_OPTIONS
                })
            }
        } catch (error) {
            throw new Error('Could not launch browser')
        }
    }

    async with(
        func: PageCallback,
        settings: Settings,
        currentPage?: Page
    ): Promise<Page> {
        if (!this.browser) await this.initialize(settings)

        let page = currentPage
        try {
            if (!page) page = await this.newPage(settings)
            await func(page)
        } catch (error) {
            console.log(error)
        } finally {
            // if (page) await page.close()
        }

        return page!
    }

    async getPageContent(
        page: Page,
        link: string,
        before?: (page: Page) => Promise<void>
    ) {
        const response = await page.goto(link)
        if (before) await before(page)

        await stripScriptTags(page)
        await removeAttribute(page, 'img', 'srcset')

        if (!response) {
            throw new Error(`Couldn't get website content for ${link}`)
        }

        const chain = response.request().redirectChain()
        let url: string

        try {
            url = chain[0].frame()!.url()
        } catch (error) {
            url = link
        }

        const html = await page.content()

        return {
            url,
            html
        }
    }

    async newPage(settings: Settings = {}) {
        const { debug, puppeteer } = settings
        const page = await this.browser!.newPage()

        if (puppeteer?.proxy && puppeteer?.authorization) {
            await page.setExtraHTTPHeaders({
                'Proxy-Authorization': puppeteer.authorization
            })
        }

        debug && page.on('console', msg => console.log('DEBUG:', msg.text()))

        if (isTestEnv() && this.mockHandler) {
            await page.setRequestInterception(true)
            page.on('request', async req => {
                const mockResult = await this.mockHandler!(req.url())
                mockResult && req.respond(mockResult)
            })
        }

        const userAgent = new UserAgent({ deviceCategory: 'desktop' })
        await page.setUserAgent(userAgent.toString())
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
        })

        return page
    }

    async forkPage(page: Page, settings: Settings = {}) {
        const newPage = await this.newPage(settings)
        await newPage.goto(page.url())
        return newPage
    }

    setMockHandler(handler: MockHandler) {
        this.mockHandler = handler
    }

    resetMockHandler() {
        this.mockHandler = undefined
    }

    async logPages() {
        console.log((await this.browser?.pages())?.length)
    }

    async cleanup() {
        if (!this.browser) return

        this.browser.removeAllListeners()

        for (const page of await this.browser.pages()) {
            await page.close()
        }

        await this.browser.close()

        if (this.settings.puppeteer?.endpoint) {
            this.browser.disconnect()
        } else {
            treekill(this.browser.process().pid, 'SIGKILL')
        }
    }
}

export default CustomBrowser
