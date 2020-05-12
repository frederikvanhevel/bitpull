import { Page } from 'puppeteer'
import { NodeError, ParseError } from '../../common/errors'
import { NodeParser, NodeInput, TraverseOptions } from '../../../typedefs/node'
import { assert } from '../../../utils/common'
import { randomizedDelay } from '../../../utils/delay'
import { FlowError } from '../../../utils/errors'
import { ClickError } from '../click/errors'
import { HtmlError } from '../html/errors'
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
        throw new FlowError(ClickError.COULD_NOT_CLICK, error)
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

        await func(page)

        let currentContent
        try {
            hasNext = await hasNextButton()
            currentContent = await page.content()
        } catch (error) {
            throw new FlowError(HtmlError.NAVIGATION_FAILED, error)
        }

        if (currentContent === lastContent) break

        lastContent = currentContent

        parsedPages++
    }
}

const pagination: NodeParser<PaginationNode, PaginationParseResult> = async (
    input,
    options,
    context
) => {
    const { watchedNodeId, onWatch, onLog } = options
    const { node, page } = input
    const { traverser, browser } = context
    const pagination = node.pagination

    assert(node.children && node.children.length, NodeError.CHILD_NODE_MISSING)

    const childNode = node.children!.find(
        child => child.id === node.goToPerPage
    )

    assert(childNode, PaginationError.GOTOPERPAGE_NODE_MISSING)
    assert(node.pagination, PaginationError.PAGINATION_METHOD_MISSING)

    const allResults: PaginationParseResult = []
    const parseChildNodes = async (page: Page) => {
        const forkedPage = await browser.forkPage(page, options.settings)
        await traverser.parseNode({
            ...input,
            node: childNode!,
            parent: node,
            page: forkedPage,
            branchCallback: data => {
                if (onWatch && node.id === watchedNodeId) onWatch(data)
                allResults.push(data)
            }
        })
        // await forkedPage.close()
    }

    // parse current page
    await parseChildNodes(page!)

    if (onLog) onLog(node, 'Started pagination')

    // TODO add other pagination types
    if (isNextLinkPagination(pagination)) {
        await loopNextButton(input, parseChildNodes, options)
    }

    return { ...input, passedData: allResults! }
}

export default pagination
