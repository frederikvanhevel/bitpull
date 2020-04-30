import { NodeError, ParseError } from '../../common/errors'
import { NodeParser, NodeInput, TraverseOptions } from '../../../typedefs/node'
import { assert } from '../../../utils/common'
import { randomizedDelay } from '../../../utils/delay'
import { FlowError } from '../../../utils/errors'
import { ClickError } from '../click/errors'
import { PaginationError } from './errors'
import {
    PaginationNode,
    NextLinkPagination,
    PaginationParseResult
} from './typedefs'
import { isNextLinkPagination } from './helper'

const clickNextButton = async (
    input: NodeInput<PaginationNode>,
    selector: string
) => {
    const { page } = input

    assert(!!page, ParseError.PAGE_MISSING)

    try {
        await page.click(selector)
    } catch (error) {
        console.log(error)
        throw new FlowError(ClickError.COULD_NOT_CLICK)
    }

    // add random delay between requests
    await randomizedDelay()
}

const loopNextButton = async (
    input: NodeInput<PaginationNode>,
    func: Function,
    options: TraverseOptions
) => {
    const { onLog } = options
    const { node, page } = input

    const pagination = node.pagination as NextLinkPagination

    assert(pagination.nextLink, PaginationError.NEXT_LINK_MISSING)
    assert(!!page, ParseError.PAGE_MISSING)

    const nextButtonSelector = pagination.nextLink.value

    const hasNextButton = async () => {
        return (await page.$(nextButtonSelector)) !== null
    }

    const linkLimit = node.linkLimit || Number.POSITIVE_INFINITY
    let parsedPages = 1
    let hasNext = await hasNextButton()
    let lastContent = await page.content()

    if (!hasNext && onLog) {
        onLog(node, 'No next page link found')
    }

    while (hasNext && parsedPages < linkLimit) {
        if (onLog) onLog(node, 'Found next page button')

        await clickNextButton(input, nextButtonSelector)

        await func()

        hasNext = await hasNextButton()

        const currentContent = await page.content()

        if (currentContent === lastContent) break

        lastContent = currentContent

        parsedPages++
    }
}

// const parseLinkList = async (
//     input: NodeInput<PaginationNode>,
//     func: Function,
//     options: TraverseOptions,
//     context: Context
// ) => {
//     const { node, rootAncestor, parentResult } = input
//     const parser = getSelectorParser(rootAncestor!)
//     const pagination = node.pagination as LinkListPagination

//     assert(parser, ParseError.NO_SELECTOR_PARSER_FOUND)
//     assert(
//         pagination.linkList && Array.isArray(pagination.linkList),
//         PaginationError.NO_LINKS_SPECIFIED
//     )
//     assert(parentResult.html, ParseError.HTML_MISSING)

//     for (const link of pagination.linkList) {
//         const url =
//             pagination.prependUrl || pagination.prependUrl === undefined
//                 ? getUriOrigin(rootAncestor!.link!) + link
//                 : link

//         // TODO should use html node directly and get result
//         const htmlForThatPage = await parseLink(input, url, options, context)

//         await func(htmlForThatPage)
//     }
// }

const pagination: NodeParser<PaginationNode, PaginationParseResult> = async (
    input,
    options,
    context
) => {
    const { watchedNodeId, onWatch, onLog } = options
    const { node } = input
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
        branchCallback: (data: any) => {
            if (onWatch && node.id === watchedNodeId) onWatch(data)
            allResults.push(data)
        }
    })

    const parseChildNodes = async () => {
        await traverser.parseNode({
            ...input,
            node: childNode!,
            parent: node,
            branchCallback: data => allResults.push(data)
        })
    }

    if (onLog) onLog(node, 'Started pagination')

    // TODO add other pagination types
    if (isNextLinkPagination(pagination)) {
        await loopNextButton(input, parseChildNodes, options)
    }

    //  else if (isLinkListPagination(pagination)) {
    //     await parseLinkList(input, parseChildNodes, options, context)
    // }

    // if (onWatch && node.id === watchedNodeId) onWatch(allResults!)

    return { ...input, passedData: allResults! }
}

export default pagination
