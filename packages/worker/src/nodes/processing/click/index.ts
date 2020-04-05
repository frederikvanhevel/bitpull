import { Page } from 'puppeteer-core'
import { NodeError, ParseError } from '../../common/errors'
import { NodeParser, NodeInput } from '../../../typedefs/node'
import { assert, clamp } from '../../../utils/common'
import { HtmlParseResult } from '../html/typedefs'
import { absolutifyHtml } from '../../../utils/helper'
import { ClickNode } from './typedefs'

const MIN_DELAY = 1
const MAX_DELAY = 60

const click: NodeParser<ClickNode, undefined, HtmlParseResult> = async (
    input: NodeInput<ClickNode, undefined, HtmlParseResult>,
    options,
    context
) => {
    const { settings, onLog } = options
    const { browser } = context
    const { node, rootAncestor, parentResult } = input
    const { selector, waitForNavigation, delay = 0 } = node

    assert(rootAncestor, NodeError.NEEDS_ROOT_ANCESTOR)
    assert(rootAncestor.parseJavascript, NodeError.NEEDS_REAL_BROWSER)
    assert(
        rootAncestor.parsedLink || parentResult!.html,
        ParseError.LINK_MISSING
    )
    assert(node.selector, ParseError.SELECTOR_MISSING)

    let renderedHtml: string

    await browser.with(async (page: Page) => {
        if (parentResult && parentResult!.html) {
            const displayHtml = absolutifyHtml(
                parentResult.html,
                parentResult.url,
                settings.proxyEndpoint
            )
            await page.setContent(displayHtml)
        } else await page.goto(rootAncestor!.parsedLink!)

        await page.click(selector)

        if (waitForNavigation) await page.waitForNavigation()
        else {
            const ms = clamp(MIN_DELAY + delay, MIN_DELAY, MAX_DELAY) * 1000
            await page.waitFor(ms)
        }

        renderedHtml = await page.content()
    }, settings)

    assert(renderedHtml!, ParseError.ERROR_RENDERING_HTML)

    if (onLog) onLog(node, 'Clicked element')

    return Promise.resolve({
        ...input,
        parentResult: {
            html: renderedHtml!,
            url: rootAncestor!.parsedLink!
        }
    })
}

export default click
