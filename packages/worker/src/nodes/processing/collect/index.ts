import { NodeParser, NodeType } from '../../../typedefs/node'
import { assert, sequentialPromise } from '../../../utils/common'
import { getFieldsFromHtml } from '../selectors'
import { hasChildOfTypes } from '../../../utils/helper'
import { HtmlNode } from '../html/typedefs'
import { NodeError } from '../../../nodes/common/errors'
import { mergeData } from './helper'
import { CollectError } from './errors'
import { CollectNode, CollectParseResult } from './typedefs'

const collect: NodeParser<CollectNode, CollectParseResult> = async (
    input,
    options,
    context
) => {
    const { watchedNodeId, onWatch, onLog, onError, settings } = options
    const { node } = input
    const { traverser } = context

    assert(node.fields && node.fields.length, CollectError.FIELDS_MISSING)
    assert(node.fields[0].label !== '', CollectError.FIELDS_MISSING)

    const parsedFields = await getFieldsFromHtml(input, settings)

    if (onLog) {
        const fields = node.fields.map(field => field.label)
        onLog(node, `Collected fields [${fields}] from page`)
    }

    const data =
        node.append === true && !!input.passedData
            ? mergeData(input.passedData, parsedFields)
            : parsedFields

    if (onWatch && node.id === watchedNodeId) onWatch(data)

    const htmlChild = node.children?.length
        ? (node.children[0] as HtmlNode)
        : undefined

    if (
        (hasChildOfTypes(node, [NodeType.HTML]),
        !!htmlChild?.linkedField && Array.isArray(data))
    ) {
        assert(node.children?.length === 1, NodeError.TOO_MANY_CHILDREN)

        const iteratedResult = data.slice(0, node.limit)

        await sequentialPromise(iteratedResult, async item => {
            return traverser
                .parseNode({
                    ...input,
                    node: htmlChild!,
                    parent: node,
                    parentResult: item,
                    passedData: item
                })
                .catch(error => {
                    if (settings.exitOnError) {
                        throw error
                    } else if (onError) {
                        onError(htmlChild!, error)
                    }
                })
        })
    }

    return Promise.resolve({
        ...input,
        passedData: data
    })
}

export default collect
