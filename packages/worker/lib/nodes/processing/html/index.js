"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../common/errors");
const common_1 = require("../../../utils/common");
const absolutify_1 = require("../../../utils/absolutify");
const errors_2 = require("./errors");
const html = async (input, options, context) => {
    const { onLog, settings } = options;
    const { browser } = context;
    const { node, passedData, rootAncestor } = input;
    const { parseJavascript, delay, waitForNavigation } = node;
    let link = node.link;
    if (node.linkedField) {
        common_1.assert(rootAncestor, errors_1.NodeError.NEEDS_ROOT_ANCESTOR);
        if (node.disallowUndefined) {
            common_1.assert(passedData[node.linkedField], errors_2.HtmlError.LINKED_FIELD_MISSING);
        }
        if (!passedData[node.linkedField]) {
            return Promise.resolve(Object.assign(Object.assign({}, input), { parentResult: {
                    html: '<html></html>',
                    url: rootAncestor.link
                } }));
        }
        link = absolutify_1.absolutifyUrl(passedData[node.linkedField], common_1.getUriOrigin(rootAncestor.link));
    }
    common_1.assert(link, errors_1.ParseError.LINK_MISSING);
    let html;
    let url = link;
    if (parseJavascript) {
        await browser.with(async (page) => {
            const result = await browser.getPageContent(page, link, delay, waitForNavigation);
            html = result.html;
            url = result.url;
        }, settings);
    }
    else {
        html = await common_1.request(link);
    }
    onLog && onLog(node, `Got content of ${link}`);
    // set the parsed link on the node so we can retrieve it later
    node.parsedLink = link;
    return Promise.resolve(Object.assign(Object.assign({}, input), { parentResult: {
            html,
            url
        } }));
};
exports.default = html;
//# sourceMappingURL=index.js.map