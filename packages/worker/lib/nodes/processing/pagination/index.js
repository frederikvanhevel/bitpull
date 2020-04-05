"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../../common/errors");
const node_1 = require("../../../typedefs/node");
const common_1 = require("../../../utils/common");
const selectors_1 = require("../selectors");
const html_1 = __importDefault(require("../html"));
const xml_1 = __importDefault(require("../xml"));
const delay_1 = require("../../../utils/delay");
const errors_2 = require("./errors");
const helper_1 = require("./helper");
const parseLink = async (input, link, options, context) => {
    const { rootAncestor } = input;
    common_1.assert(rootAncestor, errors_1.NodeError.NEEDS_ROOT_ANCESTOR);
    let parser;
    if (rootAncestor.type === node_1.NodeType.HTML) {
        parser = html_1.default;
    }
    else if (rootAncestor.type === node_1.NodeType.XML) {
        parser = xml_1.default;
    }
    common_1.assert(parser, errors_1.NodeError.NODE_NOT_FOUND);
    // add random delay between requests
    await delay_1.randomizedDelay();
    const result = await parser({
        node: {
            id: '0',
            type: rootAncestor.type,
            link,
            parseJavascript: rootAncestor.parseJavascript
        }
    }, options, context);
    return result.parentResult.html;
};
const loopNextLinks = async (input, func, options, context) => {
    const { onLog } = options;
    const { node, rootAncestor, parentResult } = input;
    const parser = selectors_1.getSelectorParser(rootAncestor);
    const pagination = node.pagination;
    common_1.assert(parser, errors_1.ParseError.NO_SELECTOR_PARSER_FOUND);
    common_1.assert(pagination.nextLink, errors_2.PaginationError.NEXT_LINK_MISSING);
    common_1.assert(parentResult, errors_1.ParseError.HTML_MISSING);
    common_1.assert(parentResult.html, errors_1.ParseError.HTML_MISSING);
    let nextUrl = parser(parentResult.html, pagination.nextLink, parentResult.url);
    if (!nextUrl && onLog)
        onLog(node, 'No next page link found');
    const linkLimit = node.linkLimit || Number.POSITIVE_INFINITY;
    let parsedPages = 1;
    while (nextUrl && parsedPages < linkLimit) {
        if (onLog)
            onLog(node, `Found next page link: ${nextUrl}`);
        const url = helper_1.getFullUrl(nextUrl, rootAncestor.link);
        const htmlForThatPage = await parseLink(input, url, options, context);
        await func(htmlForThatPage);
        nextUrl = parser(htmlForThatPage, pagination.nextLink, url);
        parsedPages++;
    }
};
const parseLinkList = async (input, func, options, context) => {
    const { node, rootAncestor, parentResult } = input;
    const parser = selectors_1.getSelectorParser(rootAncestor);
    const pagination = node.pagination;
    common_1.assert(parser, errors_1.ParseError.NO_SELECTOR_PARSER_FOUND);
    common_1.assert(pagination.linkList && Array.isArray(pagination.linkList), errors_2.PaginationError.NO_LINKS_SPECIFIED);
    common_1.assert(parentResult.html, errors_1.ParseError.HTML_MISSING);
    for (const link of pagination.linkList) {
        const url = pagination.prependUrl || pagination.prependUrl === undefined
            ? common_1.getUriOrigin(rootAncestor.link) + link
            : link;
        // TODO should use html node directly and get result
        const htmlForThatPage = await parseLink(input, url, options, context);
        await func(htmlForThatPage);
    }
};
const pagination = async (input, options, context) => {
    const { watchedNodeId, onWatch, onLog } = options;
    const { node, parentResult, passedData } = input;
    const { traverser } = context;
    const pagination = node.pagination;
    common_1.assert(node.children && node.children.length, errors_1.NodeError.CHILD_NODE_MISSING);
    const childNode = node.children.find(child => child.id === node.goToPerPage);
    common_1.assert(childNode, errors_2.PaginationError.GOTOPERPAGE_NODE_MISSING);
    common_1.assert(node.pagination, errors_2.PaginationError.PAGINATION_METHOD_MISSING);
    const allResults = [];
    // parse current page
    await traverser.parseNode(Object.assign(Object.assign({}, input), { node: childNode, parent: node, parentResult,
        passedData, paginationCallback: (data) => allResults.push(data) }));
    const parseChildNodes = async (html) => {
        await traverser.parseNode(Object.assign(Object.assign({}, input), { node: childNode, parent: node, parentResult: { html }, passedData, paginationCallback: (data) => allResults.push(data) }));
    };
    if (onLog)
        onLog(node, 'Started pagination');
    // TODO add other pagination types
    if (helper_1.isNextLinkPagination(pagination)) {
        await loopNextLinks(input, parseChildNodes, options, context);
    }
    else if (helper_1.isLinkListPagination(pagination)) {
        await parseLinkList(input, parseChildNodes, options, context);
    }
    if (onWatch && node.id === watchedNodeId)
        onWatch(allResults);
    return Object.assign(Object.assign({}, input), { passedData: allResults });
};
exports.default = pagination;
