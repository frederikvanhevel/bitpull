"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const user_agents_1 = __importDefault(require("user-agents"));
const chrome_aws_lambda_1 = __importDefault(require("chrome-aws-lambda"));
const tree_kill_1 = __importDefault(require("tree-kill"));
const common_1 = require("../utils/common");
const scripts_1 = require("../utils/scripts");
const DEFAULT_OPTIONS = {
    defaultViewport: {
        width: 1920,
        height: 1080
    },
    slowMo: 10,
    headless: true
};
const getPuppeteerArgs = (settings) => {
    const { puppeteer } = settings;
    const args = (puppeteer === null || puppeteer === void 0 ? void 0 : puppeteer.endpoint) ? [] : chrome_aws_lambda_1.default.args;
    return [
        ...args,
        ...((puppeteer === null || puppeteer === void 0 ? void 0 : puppeteer.proxy) ? [`--proxy-server=${puppeteer === null || puppeteer === void 0 ? void 0 : puppeteer.proxy}`] : [])
    ];
};
class CustomBrowser {
    constructor() {
        this.settings = {};
    }
    async initialize(settings = {}) {
        var _a;
        this.settings = settings;
        try {
            if ((_a = settings.puppeteer) === null || _a === void 0 ? void 0 : _a.endpoint) {
                this.browser = await puppeteer_core_1.default.connect(Object.assign(Object.assign({ browserWSEndpoint: settings.puppeteer.endpoint, ignoreHTTPSErrors: true }, getPuppeteerArgs(settings)), DEFAULT_OPTIONS));
            }
            else {
                this.browser = await chrome_aws_lambda_1.default.puppeteer.launch(Object.assign(Object.assign({ executablePath: await chrome_aws_lambda_1.default.executablePath }, getPuppeteerArgs(settings)), DEFAULT_OPTIONS));
            }
        }
        catch (error) {
            throw new Error('Could not launch browser');
        }
    }
    async with(func, settings) {
        const { puppeteer } = settings;
        if (!this.browser)
            await this.initialize(settings);
        let page;
        try {
            page = await this.browser.newPage();
            if ((puppeteer === null || puppeteer === void 0 ? void 0 : puppeteer.proxy) && (puppeteer === null || puppeteer === void 0 ? void 0 : puppeteer.authorization)) {
                await page.setExtraHTTPHeaders({
                    'Proxy-Authorization': puppeteer.authorization
                });
            }
            this.settings.debug &&
                page.on('console', msg => console.log('DEBUG:', msg.text()));
            if (common_1.isTestEnv() && this.mockHandler) {
                page.setRequestInterception(true);
                page.on('request', async (req) => {
                    const mockResult = await this.mockHandler(req.url());
                    mockResult && req.respond(mockResult);
                });
            }
            const userAgent = new user_agents_1.default({ deviceCategory: 'desktop' });
            await page.setUserAgent(userAgent.toString());
            await page.setExtraHTTPHeaders({
                'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8'
            });
            await func(page);
        }
        finally {
            if (page)
                await page.close();
        }
    }
    async getPageContent(page, link, delay, waitForNavigation) {
        const response = await page.goto(link);
        if (waitForNavigation)
            await page.waitForNavigation();
        if (delay)
            await page.waitFor(delay);
        await scripts_1.stripScriptTags(page);
        await scripts_1.removeAttribute(page, 'img', 'srcset');
        if (!response) {
            throw new Error(`Couldn't get website content for ${link}`);
        }
        const chain = response.request().redirectChain();
        let url;
        try {
            url = chain[0].frame().url();
        }
        catch (error) {
            url = link;
        }
        const html = await page.content();
        return {
            url,
            html
        };
    }
    setMockHandler(handler) {
        this.mockHandler = handler;
    }
    resetMockHandler() {
        this.mockHandler = undefined;
    }
    async cleanup() {
        var _a;
        if (!this.browser)
            return;
        this.browser.removeAllListeners();
        if ((_a = this.settings.puppeteer) === null || _a === void 0 ? void 0 : _a.endpoint) {
            this.browser.disconnect();
        }
        else {
            await this.browser.close();
            tree_kill_1.default(this.browser.process().pid, 'SIGKILL');
        }
    }
}
exports.default = CustomBrowser;
