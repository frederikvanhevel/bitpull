import { Page } from 'puppeteer-core'
import { ParseError } from '../../common/errors'
import { assert } from '../../../utils/common'
import { NodeInput, TraverseOptions, Context } from '../../../typedefs/node'
import { HtmlNode, LinkedHtmlNode, MultipleHtmlNode } from './typedefs'
import { FlowError } from '../../../utils/errors'
import { HtmlError } from './errors'

export const parseLink = async (
    input: NodeInput<HtmlNode | LinkedHtmlNode | MultipleHtmlNode>,
    options: TraverseOptions,
    context: Context,
    link: string
): Promise<Page> => {
    const { onLog, settings } = options
    const { browser } = context
    const { node, page } = input

    assert(link, ParseError.LINK_MISSING)

    let currentPage
    try {
        currentPage = await browser.with(
            async (page: Page) => {
                await page.goto(link, {
                    waitUntil: "networkidle2"
                })
            },
            settings,
            page
        )
    } catch (error) {
        throw new FlowError(HtmlError.NAVIGATION_FAILED, error)
    }

    onLog && onLog(node, `Got content of ${link}`)

    return currentPage
}
