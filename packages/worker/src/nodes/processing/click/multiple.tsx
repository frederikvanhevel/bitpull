import { Page } from 'puppeteer-core'
import { FlowError } from '../../../utils/errors'
import { ParseError } from '../../common/errors'
import { NodeParser, NodeInput } from '../../../typedefs/node'
import { assert, sequentialPromise } from '../../../utils/common'
import { PaginationError } from '../pagination/errors'
import { findPerPageNode } from '../../../utils/helper'
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

    const allResults: object[] = []

    await browser.with(
        async (page: Page) => {
            const elements = await page.$$(selector)
            const allowed = elements.slice(0, node.limit)

            await sequentialPromise(allowed, async element => {
                try {
                    await element.click()
                } catch (error) {
                    throw new FlowError(ClickError.COULD_NOT_CLICK)
                }

                if (onLog) onLog(node, 'Clicked element')

                await wait(page, delay, waitForNavigation)

                if (node.children?.length) {
                    const childNode = findPerPageNode(node)
                    assert(childNode, PaginationError.GOTOPERPAGE_NODE_MISSING)

                    await traverser.parseNode({
                        ...input,
                        node: childNode!,
                        parent: node,
                        page,
                        branchCallback: data => allResults.push(data)
                    })
                }
            })
        },
        settings,
        page
    )

    return { ...input, passedData: allResults! }
}

export default clickMultiple
