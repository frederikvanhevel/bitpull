import { Page } from 'puppeteer-core'
import { FlowError } from '../../../utils/errors'
import { ParseError } from '../../common/errors'
import { NodeParser, NodeInput } from '../../../typedefs/node'
import { assert } from '../../../utils/common'
import { ClickNode } from './typedefs'
import { ClickError } from './errors'
import { wait } from './helper'

const click: NodeParser<ClickNode> = async (
    input: NodeInput<ClickNode>,
    options,
    context
) => {
    const { settings, onLog } = options
    const { browser } = context
    const { node, page } = input
    const { selector, waitForNavigation, delay = 0 } = node

    assert(selector, ParseError.SELECTOR_MISSING)

    try {
        await browser.with(
            async (page: Page) => {
                await page.click(selector)
                await wait(page, delay, waitForNavigation)
            },
            settings,
            page
        )
    } catch (error) {
        throw new FlowError(ClickError.COULD_NOT_CLICK)
    }

    if (onLog) onLog(node, 'Clicked element')

    return Promise.resolve(input)
}

export default click
