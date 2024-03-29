import { NodeError } from '../../common/errors'
import { assert, sequentialPromise } from '../../../utils/common'
import { NodeParser } from '../../../typedefs/node'
import { PaginationError } from '../pagination/errors'
import { MultipleHtmlNode } from './typedefs'
import { HtmlError } from './errors'
import { parseLink } from './helper'
import { findPerPageNode } from '../../../utils/helper'

const multipleHtml: NodeParser<MultipleHtmlNode> = async (
    input,
    options,
    context
) => {
    const { node } = input
    const { traverser } = context

    assert(node.links && node.links.length, HtmlError.LINKS_MISSING)

    if (node.children?.length) {
        const childNode = findPerPageNode(node)

        assert(childNode, PaginationError.GOTOPERPAGE_NODE_MISSING)

        const allowedLinks = node.links.slice(0, node.limit)
        const allResults: object[] = []

        await sequentialPromise<string>(allowedLinks, async link => {
            const page = await parseLink(input, options, context, link)

            assert(
                node.children && node.children.length,
                NodeError.CHILD_NODE_MISSING
            )

            const root = {
                ...node,
                parsedLink: link
            }

            await traverser.parseNode({
                ...input,
                node: childNode,
                parent: root,
                rootAncestor: root,
                page,
                branchCallback: data => allResults.push(data)
            })
        })

        return { ...input, passedData: allResults! }
    }

    node.parsedLink = node.links[0]

    // in the case of a simple tree traverse
    return {
        ...input,
        page: await parseLink(input, options, context, node.links[0])
    }
}

export default multipleHtml
