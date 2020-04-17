"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const cheerio_1 = __importDefault(require("cheerio"));
const node_1 = require("../../typedefs/node");
const common_1 = require("../../utils/common");
const absolutify_1 = require("../../utils/absolutify");
const HTML_MISSING = 'HTML_MISSING';
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
exports.getFieldFromHtml = (html, selector, url, xmlMode = false) => {
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
exports.getFieldsFromHtml = (input, settings, xmlMode = false) => {
    const { node, parentResult } = input;
    assert_1.default(parentResult.html, HTML_MISSING);
    const $ = cheerio_1.default.load(parentResult.html, { xmlMode });
    const arrayMapping = [];
    node.fields.forEach(field => {
        $(field.selector.value).each((i, element) => {
            // only collect as many items as the limit if its set
            if (node.limit && i >= node.limit)
                return;
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
            // TODO check if link with proxy url prefixed
            // if so then remove and decode
            arrayMapping[i] = Object.assign(Object.assign({}, arrayMapping[i]), {
                [field.label]: isNumeric(val)
                    ? parseInt(trimmedVal, 10)
                    : trimmedVal
            });
        });
    });
    return arrayMapping.length === 1 ? arrayMapping[0] : arrayMapping;
};
exports.getFieldFromXml = (html, field, url) => {
    return exports.getFieldFromHtml(html, field, url, true);
};
exports.getFieldsFromXml = (input, settings) => {
    return exports.getFieldsFromHtml(input, settings, true);
};
exports.getSelectorParser = (node) => {
    if (node.type === node_1.NodeType.HTML) {
        return exports.getFieldFromHtml;
    }
    else if (node.type === node_1.NodeType.XML) {
        return exports.getFieldFromXml;
    }
    return null;
};
//# sourceMappingURL=selectors.js.map