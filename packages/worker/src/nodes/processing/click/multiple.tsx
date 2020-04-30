import { Page } from 'puppeteer-core'
import { FlowError } from '../../../utils/errors'
import { NodeError, ParseError } from '../../common/errors'
import { NodeParser, NodeInput } from '../../../typedefs/node'
import { assert, sequentialPromise } from '../../../utils/common'
import { PaginationError } from '../pagination/errors'
import { MultipleClickNode } from './typedefs'
import { ClickError } from './errors'
import { wait } from './helper'

const clickMultiple: NodeParser<MultipleClickNode> = async (
    input: NodeInput<MultipleClickNode>,
    options,
    context
) => {
    const { settings, onLog } = options
    const { traverser, browser } = context
    const { node, page } = input
    const { selector, waitForNavigation, delay = 0 } = node

    assert(node.selector, ParseError.SELECTOR_MISSING)
    assert(node.children?.length, NodeError.CHILD_NODE_MISSING)

    const childNode = node.goToPerPage
        ? node.children.find(child => child.id === node.goToPerPage)
        : node.children[0]

    assert(childNode, PaginationError.GOTOPERPAGE_NODE_MISSING)

    const allResults: object[] = []

    await browser.with(
        async (page: Page) => {
            const elements = await page.$$(selector)
            const allowed = elements.slice(0, node.limit)

            await sequentialPromise(allowed, async element => {
                try {
                    await element.click()

                    if (onLog) onLog(node, 'Clicked element')

                    await wait(page, delay, waitForNavigation)

                    await traverser.parseNode({
                        ...input,
                        node: childNode,
                        parent: node,
                        page,
                        branchCallback: data => allResults.push(data)
                    })
                } catch (error) {
                    throw new FlowError(ClickError.COULD_NOT_CLICK)
                }
            })
        },
        settings,
        page
    )

    return { ...input, passedData: allResults! }
}

export default clickMultiple
