"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../common/errors");
const common_1 = require("../../../utils/common");
const absolutify_1 = require("../../../utils/absolutify");
const MIN_DELAY = 1;
const MAX_DELAY = 60;
const click = async (input, options, context) => {
    const { settings, onLog } = options;
    const { browser } = context;
    const { node, rootAncestor, parentResult } = input;
    const { selector, waitForNavigation, delay = 0 } = node;
    common_1.assert(rootAncestor, errors_1.NodeError.NEEDS_ROOT_ANCESTOR);
    common_1.assert(rootAncestor.parseJavascript, errors_1.NodeError.NEEDS_REAL_BROWSER);
    common_1.assert(rootAncestor.parsedLink || parentResult.html, errors_1.ParseError.LINK_MISSING);
    common_1.assert(node.selector, errors_1.ParseError.SELECTOR_MISSING);
    let renderedHtml;
    await browser.with(async (page) => {
        try {
            page.on("error", function (err) {
                let theTempValue = err.toString();
                console.log("Error: " + theTempValue);
            });
            if (parentResult && parentResult.html) {
                const displayHtml = absolutify_1.absolutifyHtml(parentResult.html, parentResult.url, settings.proxyEndpoint);
                await page.setContent(displayHtml);
            }
            else
                await page.goto(rootAncestor.parsedLink);
            await page.click(selector);
            if (waitForNavigation)
                await page.waitForNavigation();
            else {
                const ms = common_1.clamp(MIN_DELAY + delay, MIN_DELAY, MAX_DELAY) * 1000;
                await page.waitFor(ms);
            }
            renderedHtml = await page.content();
        }
        catch (error) {
            throw new Error('Could not click element');
        }
    }, settings);
    common_1.assert(renderedHtml, errors_1.ParseError.ERROR_RENDERING_HTML);
    if (onLog)
        onLog(node, 'Clicked element');
    return Promise.resolve(Object.assign(Object.assign({}, input), { parentResult: {
            html: renderedHtml,
            url: rootAncestor.parsedLink
        } }));
};
exports.default = click;
