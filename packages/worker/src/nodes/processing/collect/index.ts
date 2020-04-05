import { NodeParser } from '../../../typedefs/node'
import { assert } from '../../../utils/common'
import { getFieldsFromHtml } from '../selectors'
import { CollectNode, CollectParseResult } from './typedefs'
import { CollectError } from './errors'

const collect: NodeParser<CollectNode, CollectParseResult> = (
    input,
    options
) => {
    const { watchedNodeId, onWatch, onLog, settings } = options
    const { node } = input

    assert(node.fields && node.fields.length, CollectError.FIELDS_MISSING)

    const parsedFields = getFieldsFromHtml(input, settings)

    if (onLog) {
        const fields = node.fields.map(field => field.label)
        onLog(node, `Collected fields [${fields}] from page`)
    }

    const data = node.append
        ? { ...parsedFields, ...input.passedData }
        : parsedFields

    if (onWatch && node.id === watchedNodeId) onWatch(data)

    return Promise.resolve({
        ...input,
        passedData: data
    })
}

export default collect
