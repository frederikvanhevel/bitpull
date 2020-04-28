"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const cheerio_1 = __importDefault(require("cheerio"));
const common_1 = require("../../utils/common");
const absolutify_1 = require("../../utils/absolutify");
const errors_1 = require("../../utils/errors");
const errors_2 = require("../common/errors");
var ATTRIBUTE_TO_ELEMENT_MAP;
(function (ATTRIBUTE_TO_ELEMENT_MAP) {
    ATTRIBUTE_TO_ELEMENT_MAP["href"] = "a";
    ATTRIBUTE_TO_ELEMENT_MAP["src"] = "img";
})(ATTRIBUTE_TO_ELEMENT_MAP || (ATTRIBUTE_TO_ELEMENT_MAP = {}));
function isNumeric(num) {
    // @ts-ignore
    return !isNaN(num);
}
function isValidAttribute(attribute) {
    return attribute in ATTRIBUTE_TO_ELEMENT_MAP;
}
exports.getFieldFromPage = async (page, selector, url, xmlMode = false) => {
    const html = await page.content();
    const $ = cheerio_1.default.load(html, { xmlMode });
    let result = selector.attribute && selector.attribute !== 'text'
        ? $(selector.value).attr(selector.attribute)
        : $(selector.value).text();
    // convert relative to absolute urls
    if (url && result && selector.attribute === 'href') {
        const origin = common_1.getUriOrigin(url);
        result = absolutify_1.absolutifyUrl(result, origin);
    }
    return result;
};
exports.getFieldsFromHtml = async (input, settings, xmlMode = false) => {
    const { node, page, rootAncestor } = input;
    assert_1.default(!!page, new errors_1.FlowError(errors_2.ParseError.PAGE_MISSING));
    const html = await page.content();
    const $ = cheerio_1.default.load(html, { xmlMode });
    const arrayMapping = [];
    node.fields.forEach(field => {
        $(field.selector.value).each((i, element) => {
            let el = $(element);
            const tagName = el[0].name;
            // see if we can find the element with attribute as a child
            if (field.selector.attribute &&
                isValidAttribute(field.selector.attribute) &&
                ATTRIBUTE_TO_ELEMENT_MAP[field.selector.attribute] !==
                    tagName) {
                el =
                    el.closest(ATTRIBUTE_TO_ELEMENT_MAP[field.selector.attribute]) || el;
            }
            const val = field.selector.attribute &&
                field.selector.attribute !== '' &&
                field.selector.attribute !== 'text'
                ? el.attr(field.selector.attribute)
                : el.text();
            let trimmedVal = val ? val.trim().replace(/[\r\n]( +)/, '') : val;
            // remove proxy url and decode if its a link
            if (trimmedVal &&
                settings.proxyEndpoint &&
                field.selector.attribute === 'href') {
                const url = trimmedVal.replace(settings.proxyEndpoint, '');
                trimmedVal = decodeURIComponent(url);
            }
            if (trimmedVal && (rootAncestor === null || rootAncestor === void 0 ? void 0 : rootAncestor.parsedLink) &&
                field.selector.attribute === 'href') {
                const origin = common_1.getUriOrigin(rootAncestor.parsedLink);
                trimmedVal = absolutify_1.absolutifyUrl(trimmedVal, origin);
            }
            arrayMapping[i] = Object.assign(Object.assign({}, arrayMapping[i]), {
                [field.label]: (isNumeric(val)
                    ? parseInt(trimmedVal, 10)
                    : trimmedVal) || ''
            });
        });
    });
    return arrayMapping.length === 1 ? arrayMapping[0] : arrayMapping;
};
//# sourceMappingURL=selectors.js.map