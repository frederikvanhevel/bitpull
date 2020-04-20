import { Page } from 'puppeteer-core'
import { FlowError } from '../../../utils/errors'
import { NodeError, ParseError } from '../../common/errors'
import { NodeParser, NodeInput } from '../../../typedefs/node'
import { assert, clamp } from '../../../utils/common'
import { HtmlParseResult } from '../html/typedefs'
import { ClickNode } from './typedefs'
import { ClickError } from './errors'

const MIN_DELAY = 1
const MAX_DELAY = 60

const click: NodeParser<ClickNode, undefined, HtmlParseResult> = async (
    input: NodeInput<ClickNode, undefined, HtmlParseResult>,
    options,
    context
) => {
    const { settings, onLog } = options
    const { browser } = context
    const { node, rootAncestor, page } = input
    const { selector, waitForNavigation, delay = 0 } = node

    assert(rootAncestor, NodeError.NEEDS_ROOT_ANCESTOR)
    assert(node.selector, ParseError.SELECTOR_MISSING)

    let renderedHtml: string

    try {
        await browser.with(
            async (page: Page) => {
                await page.click(selector)

                if (waitForNavigation) await page.waitForNavigation()
                else {
                    const ms =
                        clamp(MIN_DELAY + delay, MIN_DELAY, MAX_DELAY) * 1000
                    await page.waitFor(ms)
                }

                renderedHtml = await page.content()
            },
            settings,
            page
        )
    } catch (error) {
        throw new FlowError(ClickError.COULD_NOT_CLICK)
    }

    assert(renderedHtml!, ParseError.ERROR_RENDERING_HTML)

    if (onLog) onLog(node, 'Clicked element')

    return Promise.resolve(input)
}

export default click
