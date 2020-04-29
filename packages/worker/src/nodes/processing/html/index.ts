import { FlowError } from '../../../utils/errors'
import { NodeError, ParseError } from '../../common/errors'
import { assert, getUriOrigin } from '../../../utils/common'
import { absolutifyUrl } from '../../../utils/absolutify'
import { NodeParser } from '../../../typedefs/node'
import { HtmlNode, HtmlParseResult } from './typedefs'
import { parseLink } from './helper'

const html: NodeParser<HtmlNode, undefined, HtmlParseResult> = async (
    input,
    options,
    context
) => {
    const { node, passedData, rootAncestor } = input

    assert(node.link || node.linkedField, ParseError.LINK_MISSING)

    let link: string | undefined

    if (node.linkedField) {
        assert(rootAncestor, NodeError.NEEDS_ROOT_ANCESTOR)

        if (!passedData[node.linkedField]) {
            throw new FlowError(ParseError.LINK_MISSING)
        }

        link = absolutifyUrl(
            passedData[node.linkedField],
            getUriOrigin(rootAncestor.parsedLink!)
        )
    } else {
        link = node.link
    }

    assert(link, ParseError.LINK_MISSING)

    node.parsedLink = link

    const page = await parseLink(input, options, context, link)

    return {
        ...input,
        page
    }
}

export default html
