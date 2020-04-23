import { Page } from 'puppeteer-core'
import { NodeError, ParseError } from '../../common/errors'
import { assert, getUriOrigin } from '../../../utils/common'
import { absolutifyUrl } from '../../../utils/absolutify'
import { NodeParser } from '../../../typedefs/node'
import { HtmlNode, HtmlParseResult } from './typedefs'
import { HtmlError } from './errors'

const html: NodeParser<HtmlNode, undefined, HtmlParseResult> = async (
    input,
    options,
    context
) => {
    const { onLog, settings } = options
    const { browser } = context
    const { node, passedData, rootAncestor, page } = input
    let link: string = node.link!

    if (node.linkedField) {
        assert(rootAncestor, NodeError.NEEDS_ROOT_ANCESTOR)

        if (node.disallowUndefined) {
            assert(passedData[node.linkedField], HtmlError.LINKED_FIELD_MISSING)
        }

        if (!passedData[node.linkedField]) {
            return Promise.resolve({
                ...input,
                parentResult: {
                    html: '<html></html>',
                    url: rootAncestor!.link!
                }
            })
        }

        link = absolutifyUrl(
            passedData[node.linkedField],
            getUriOrigin(rootAncestor.link!)
        )
    }

    assert(link, ParseError.LINK_MISSING)

    const currentPage = await browser.with(
        async (page: Page) => {
            await page.goto(link, { waitUntil: 'load' })
        },
        settings,
        page
    )

    onLog && onLog(node, `Got content of ${link}`)

    // set the parsed link on the node so we can retrieve it later
    node.parsedLink = link

    return Promise.resolve({
        ...input,
        page: currentPage
    })
}

export default html
