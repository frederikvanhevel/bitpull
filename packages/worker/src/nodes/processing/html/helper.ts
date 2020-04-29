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
): Promise<Page> => {
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

    return currentPage
}
