"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("../../../utils/file");
const common_1 = require("../../../utils/common");
const errors_1 = require("../../common/errors");
const absolutify_1 = require("../../../utils/absolutify");
const helper_1 = require("../../../utils/helper");
const typedefs_1 = require("./typedefs");
const pdf = async (input, options, context) => {
    const { onLog, settings } = options;
    const { browser } = context;
    const { node, rootAncestor, parentResult } = input;
    common_1.assert(helper_1.hasChildExportNodes(node), errors_1.NodeError.EXPORT_NODE_MISSING);
    common_1.assert(rootAncestor, errors_1.NodeError.NEEDS_ROOT_ANCESTOR);
    common_1.assert(rootAncestor.parsedLink || parentResult.html, errors_1.ParseError.LINK_MISSING);
    let buffer;
    await browser.with(async (page) => {
        if (parentResult && parentResult.html) {
            const displayHtml = absolutify_1.absolutifyHtml(parentResult.html, parentResult.url, settings.proxyEndpoint);
            await page.setContent(displayHtml);
        }
        else
            await page.goto(rootAncestor.parsedLink);
        buffer = await page.pdf({
            landscape: node.landscape || false,
            format: node.format || typedefs_1.PdfFormat.A4
        });
    }, settings);
    common_1.assert(buffer, errors_1.FileError.BUFFER_EMPTY);
    const path = await file_1.writeFile(buffer, file_1.FileType.PDF, file_1.FileEncoding.BINARY);
    if (onLog)
        onLog(node, 'Succesfully converted to pdf file');
    return Promise.resolve(Object.assign(Object.assign({}, input), { passedData: {
            path,
            fileName: file_1.getFileNameFromPath(path),
            encoding: file_1.FileEncoding.BINARY,
            contentType: 'application/pdf'
        } }));
};
exports.default = pdf;
