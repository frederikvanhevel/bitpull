"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("../../../utils/file");
const common_1 = require("../../../utils/common");
const errors_1 = require("../../common/errors");
const xml = async (input, options) => {
    const { onLog } = options;
    const { node, parentResult, rootAncestor } = input;
    let { link } = node;
    if (node.linkedField) {
        common_1.assert(rootAncestor, errors_1.NodeError.NEEDS_ROOT_ANCESTOR);
        link =
            common_1.getUriOrigin(rootAncestor.link) + parentResult[node.linkedField];
    }
    common_1.assert(link, errors_1.ParseError.LINK_MISSING);
    const body = await common_1.request(link);
    // TODO we don't actually need xmlToJson here and should just use
    // cheerio selectors
    const json = await file_1.parseXml(body);
    if (onLog)
        onLog(node, `Got xml content of ${link}`);
    return Promise.resolve(Object.assign(Object.assign({}, input), { parentResult: json }));
};
exports.default = xml;
