import { NodeParser, NodeInput } from '../../../typedefs/node'
import { NodeError, ParseError } from '../../common/errors'
import { HtmlParseResult } from '../html/typedefs'
import { absolutifyHtml } from '../../../utils/absolutify'
import { assert, clamp } from '../../../utils/common'
import { WaitNode } from './typedefs'

const DEFAULT_DELAY = 5
const MIN_DELAY = 0
const MAX_DELAY = 600

const wait: NodeParser<WaitNode, undefined, HtmlParseResult> = async (
    input: NodeInput<WaitNode, undefined, HtmlParseResult>,
    options,
    context
) => {
    const { settings, onLog } = options
    const { browser } = context
    const { node, rootAncestor, parentResult } = input
    const { delay = DEFAULT_DELAY } = node

    assert(rootAncestor, NodeError.NEEDS_ROOT_ANCESTOR)
    assert(
        rootAncestor.parsedLink || parentResult!.html,
        ParseError.LINK_MISSING
    )

    const ms = clamp(MIN_DELAY + delay, MIN_DELAY, MAX_DELAY) * 1000

    let html
    await browser.with(async page => {
        if (parentResult && parentResult.html) {
            const displayHtml = absolutifyHtml(
                parentResult.html,
                parentResult.url,
                settings.proxyEndpoint
            )
            await page.setContent(displayHtml)
        } else await page.goto(rootAncestor.parsedLink!)

        await page.waitFor(ms)

        html = await page.content()
    }, settings)

    if (onLog) onLog(node, `Waited for ${ms / 1000} seconds`)

    return Promise.resolve({
        ...input,
        parentResult: {
            html: html!,
            url: rootAncestor.parsedLink!
        }
    })
}

export default wait
