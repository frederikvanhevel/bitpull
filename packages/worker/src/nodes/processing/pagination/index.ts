import { NodeError, ParseError } from '../../common/errors'
import {
    NodeParser,
    NodeInput,
    NodeType,
    TraverseOptions,
    Context
} from '../../../typedefs/node'
import { getUriOrigin, assert } from '../../../utils/common'
import { getSelectorParser } from '../selectors'
import html from '../html'
import xml from '../xml'
import { HtmlParseResult } from '../html/typedefs'
import { randomizedDelay } from '../../../utils/delay'
import { PaginationError } from './errors'
import {
    PaginationNode,
    NextLinkPagination,
    LinkListPagination,
    PaginationParseResult
} from './typedefs'
import {
    isNextLinkPagination,
    isLinkListPagination,
    getFullUrl
} from './helper'

const parseLink = async (
    input: NodeInput<PaginationNode>,
    link: string,
    options: TraverseOptions,
    context: Context
) => {
    const { rootAncestor } = input

    assert(rootAncestor, NodeError.NEEDS_ROOT_ANCESTOR)

    let parser: NodeParser<any>
    if (rootAncestor!.type === NodeType.HTML) {
        parser = html
    } else if (rootAncestor!.type === NodeType.XML) {
        parser = xml
    }

    assert(parser!, NodeError.NODE_NOT_FOUND)

    // add random delay between requests
    await randomizedDelay()

    const result = await parser!(
        {
            node: {
                id: '0',
                type: rootAncestor!.type,
                link,
                parseJavascript: rootAncestor!.parseJavascript
            }
        },
        options,
        context
    )

    return result.parentResult.html
}

const loopNextLinks = async (
    input: NodeInput<PaginationNode, undefined, HtmlParseResult>,
    func: Function,
    options: TraverseOptions,
    context: Context
) => {
    const { onLog } = options
    const { node, rootAncestor, parentResult } = input
    const parser = getSelectorParser(rootAncestor!)
    const pagination = node.pagination as NextLinkPagination

    assert(parser, ParseError.NO_SELECTOR_PARSER_FOUND)
    assert(pagination.nextLink, PaginationError.NEXT_LINK_MISSING)
    assert(parentResult, ParseError.HTML_MISSING)
    assert(parentResult.html, ParseError.HTML_MISSING)

    let nextUrl = parser!(
        parentResult.html,
        pagination.nextLink,
        parentResult.url
    )

    if (!nextUrl && onLog) onLog(node, 'No next page link found')

    const linkLimit = node.linkLimit || Number.POSITIVE_INFINITY
    let parsedPages = 1

    while (nextUrl && parsedPages < linkLimit) {
        if (onLog) onLog(node, `Found next page link: ${nextUrl}`)

        const url = getFullUrl(nextUrl, rootAncestor!.link!)
        const htmlForThatPage = await parseLink(input, url, options, context)

        await func(htmlForThatPage)

        nextUrl = parser!(htmlForThatPage, pagination.nextLink, url)

        parsedPages++
    }
}

const parseLinkList = async (
    input: NodeInput<PaginationNode>,
    func: Function,
    options: TraverseOptions,
    context: Context
) => {
    const { node, rootAncestor, parentResult } = input
    const parser = getSelectorParser(rootAncestor!)
    const pagination = node.pagination as LinkListPagination

    assert(parser, ParseError.NO_SELECTOR_PARSER_FOUND)
    assert(
        pagination.linkList && Array.isArray(pagination.linkList),
        PaginationError.NO_LINKS_SPECIFIED
    )
    assert(parentResult.html, ParseError.HTML_MISSING)

    for (const link of pagination.linkList) {
        const url =
            pagination.prependUrl || pagination.prependUrl === undefined
                ? getUriOrigin(rootAncestor!.link!) + link
                : link

        // TODO should use html node directly and get result
        const htmlForThatPage = await parseLink(input, url, options, context)

        await func(htmlForThatPage)
    }
}

const pagination: NodeParser<PaginationNode, PaginationParseResult> = async (
    input,
    options,
    context
) => {
    const { watchedNodeId, onWatch, onLog } = options
    const { node, parentResult, passedData } = input
    const { traverser } = context
    const pagination = node.pagination

    assert(node.children && node.children.length, NodeError.CHILD_NODE_MISSING)

    const childNode = node.children!.find(
        child => child.id === node.goToPerPage
    )

    assert(childNode, PaginationError.GOTOPERPAGE_NODE_MISSING)
    assert(node.pagination, PaginationError.PAGINATION_METHOD_MISSING)

    const allResults: PaginationParseResult = []

    // parse current page
    await traverser.parseNode({
        ...input,
        node: childNode!,
        parent: node,
        parentResult,
        passedData,
        paginationCallback: (data: any) => allResults.push(data)
    })

    const parseChildNodes = async (html: string) => {
        await traverser.parseNode({
            ...input,
            node: childNode!,
            parent: node,
            parentResult: { html },
            passedData,
            paginationCallback: (data: any) => allResults.push(data)
        })
    }

    if (onLog) onLog(node, 'Started pagination')

    // TODO add other pagination types
    if (isNextLinkPagination(pagination)) {
        await loopNextLinks(input, parseChildNodes, options, context)
    } else if (isLinkListPagination(pagination)) {
        await parseLinkList(input, parseChildNodes, options, context)
    }

    if (onWatch && node.id === watchedNodeId) onWatch(allResults!)

    return { ...input, passedData: allResults! }
}

export default pagination
