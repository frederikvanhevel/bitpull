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
        ...(puppeteer?.proxy ? [`--proxy-server=${puppeteer?.proxy}`] : [])
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

    async with(func: PageCallback, settings: Settings) {
        const { puppeteer } = settings

        if (!this.browser) await this.initialize(settings)

        let page
        try {
            page = await this.browser!.newPage()

            if (puppeteer?.proxy && puppeteer?.authorization) {
                await page.setExtraHTTPHeaders({
                    'Proxy-Authorization': puppeteer.authorization
                })
            }

            this.settings.debug &&
                page.on('console', msg => console.log('DEBUG:', msg.text()))

            if (isTestEnv() && this.mockHandler) {
                page.setRequestInterception(true)
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

            await func(page)
        } finally {
            if (page) await page.close()
        }
    }

    async getPageContent(
        page: Page,
        link: string,
        delay?: number,
        waitForNavigation?: boolean
    ) {
        const response = await page.goto(link)
        if (waitForNavigation) await page.waitForNavigation()
        if (delay) await page.waitFor(delay)
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

    setMockHandler(handler: MockHandler) {
        this.mockHandler = handler
    }

    resetMockHandler() {
        this.mockHandler = undefined
    }

    async cleanup() {
        if (!this.browser) return

        this.browser.removeAllListeners()

        if (this.settings.puppeteer?.endpoint) {
            this.browser.disconnect()
        } else {
            await this.browser.close()
            treekill(this.browser.process().pid, 'SIGKILL')
        }
    }
}

export default CustomBrowser
