import { FlowError } from '../../../utils/errors'
import { ParseError } from '../../common/errors'
import { assert } from '../../../utils/common'
import { NodeParser } from '../../../typedefs/node'
import { HtmlNode, HtmlParseResult } from './typedefs'
import { parseLink } from './helper'
import { HtmlError } from './errors'

const html: NodeParser<HtmlNode, undefined, HtmlParseResult> = async (
    input,
    options,
    context
) => {
    const { node } = input

    assert(node.link, ParseError.LINK_MISSING)

    try {
        // eslint-disable-next-line no-new
        new URL(node.link)
    } catch (error) {
        throw new FlowError(HtmlError.INVALID_URL)
    }

    const page = await parseLink(input, options, context, node.link)

    node.parsedLink = node.link

    return {
        ...input,
        page
    }
}

export default html
