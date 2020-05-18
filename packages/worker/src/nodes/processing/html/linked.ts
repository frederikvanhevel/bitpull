import { FlowError } from '../../../utils/errors'
import { NodeError, ParseError } from '../../common/errors'
import { assert, getUriOrigin } from '../../../utils/common'
import { absolutifyUrl } from '../../../utils/absolutify'
import { NodeParser } from '../../../typedefs/node'
import { LinkedHtmlNode } from './typedefs'
import { parseLink } from './helper'
import { HtmlError } from './errors'

const htmlLinked: NodeParser<LinkedHtmlNode> = async (
    input,
    options,
    context
) => {
    const { node, passedData, rootAncestor } = input

    assert(node.linkedField, ParseError.LINK_MISSING)
    assert(rootAncestor, NodeError.NEEDS_ROOT_ANCESTOR)

    if (!passedData[node.linkedField]) {
        throw new FlowError(ParseError.LINK_MISSING)
    }

    const link = absolutifyUrl(
        passedData[node.linkedField],
        getUriOrigin(rootAncestor.parsedLink!)
    )

    if (!link) {
        throw new FlowError(HtmlError.LINKED_FIELD_NOT_FOUND)
    }

    assert(link, ParseError.LINK_MISSING)

    try {
        // eslint-disable-next-line no-new
        new URL(link)
    } catch (error) {
        throw new FlowError(HtmlError.INVALID_URL)
    }

    node.parsedLink = link

    const page = await parseLink(input, options, context, link)

    return {
        ...input,
        page
    }
}

export default htmlLinked
