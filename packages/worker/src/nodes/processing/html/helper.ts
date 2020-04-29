import { Page } from 'puppeteer-core'
import { ParseError } from '../../common/errors'
import { assert } from '../../../utils/common'
import { NodeInput, TraverseOptions, Context } from '../../../typedefs/node'
import { HtmlNode, LinkParseResult } from './typedefs'

export const parseLink = async (
    input: NodeInput<HtmlNode>,
    options: TraverseOptions,
    context: Context,
    link: string
): Promise<LinkParseResult> => {
    const { onLog, settings } = options
    const { browser } = context
    const { node, page } = input

    assert(link, ParseError.LINK_MISSING)

    const currentPage = await browser.with(
        async (page: Page) => {
            await page.goto(link, { waitUntil: 'load' })
        },
        settings,
        page
    )

    onLog && onLog(node, `Got content of ${link}`)

    // // set the parsed link on the node so we can retrieve it later
    // node.parsedLink = link

    return {
        page: currentPage,
        parsedLink: link
    }
}
