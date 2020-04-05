"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../common/errors");
const helper_1 = require("../../../utils/helper");
const common_1 = require("../../../utils/common");
const DEFAULT_DELAY = 5;
const MIN_DELAY = 0;
const MAX_DELAY = 600;
const wait = async (input, options, context) => {
    const { settings, onLog } = options;
    const { browser } = context;
    const { node, rootAncestor, parentResult } = input;
    const { delay = DEFAULT_DELAY } = node;
    common_1.assert(rootAncestor, errors_1.NodeError.NEEDS_ROOT_ANCESTOR);
    common_1.assert(rootAncestor.parsedLink || parentResult.html, errors_1.ParseError.LINK_MISSING);
    const ms = common_1.clamp(MIN_DELAY + delay, MIN_DELAY, MAX_DELAY) * 1000;
    await browser.with(async (page) => {
        if (parentResult && parentResult.html) {
            const displayHtml = helper_1.absolutifyHtml(parentResult.html, parentResult.url, settings.proxyEndpoint);
            await page.setContent(displayHtml);
        }
        else
            await page.goto(rootAncestor.parsedLink);
        await page.waitFor(ms);
    }, settings);
    if (onLog)
        onLog(node, `Waited for ${ms / 1000} seconds`);
    return Promise.resolve(input);
};
exports.default = wait;
