"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("../../../utils/file");
const common_1 = require("../../../utils/common");
const errors_1 = require("../../common/errors");
const absolutify_1 = require("../../../utils/absolutify");
const helper_1 = require("../../../utils/helper");
const screenshot = async (input, options, context) => {
    const { settings, onLog } = options;
    const { browser } = context;
    const { node, rootAncestor, parentResult } = input;
    common_1.assert(helper_1.hasChildExportNodes(node), errors_1.NodeError.EXPORT_NODE_MISSING);
    common_1.assert(rootAncestor, errors_1.NodeError.NEEDS_ROOT_ANCESTOR);
    common_1.assert(rootAncestor.parsedLink || parentResult.html, errors_1.ParseError.LINK_MISSING);
    let buffer;
    await browser.with(async (page) => {
        if (parentResult === null || parentResult === void 0 ? void 0 : parentResult.html) {
            const displayHtml = absolutify_1.absolutifyHtml(parentResult.html, parentResult.url, settings.proxyEndpoint);
            await page.setContent(displayHtml);
        }
        else
            await page.goto(rootAncestor.parsedLink);
        buffer = await page.screenshot({
            fullPage: node.fullPage || false
        });
    }, settings);
    common_1.assert(buffer, errors_1.FileError.BUFFER_EMPTY);
    const path = await file_1.writeFile(buffer, file_1.FileType.PNG, file_1.FileEncoding.BINARY);
    if (onLog)
        onLog(node, 'Succesfully saved screenshot');
    return Promise.resolve(Object.assign(Object.assign({}, input), { passedData: {
            path,
            fileName: file_1.getFileNameFromPath(path),
            encoding: file_1.FileEncoding.BINARY,
            contentType: 'image/png'
        } }));
};
exports.default = screenshot;
//# sourceMappingURL=index.js.map