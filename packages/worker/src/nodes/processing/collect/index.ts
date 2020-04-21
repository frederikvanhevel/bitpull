import { NodeParser } from '../../../typedefs/node'
import { assert } from '../../../utils/common'
import { getFieldsFromHtml } from '../selectors'
import { CollectNode, CollectParseResult } from './typedefs'
import { CollectError } from './errors'

const collect: NodeParser<CollectNode, CollectParseResult> = async (
    input,
    options
) => {
    const { watchedNodeId, onWatch, onLog, settings } = options
    const { node } = input

    assert(node.fields && node.fields.length, CollectError.FIELDS_MISSING)
    assert(node.fields[0].label !== '', CollectError.FIELDS_MISSING)

    const parsedFields = await getFieldsFromHtml(input, settings)

    if (onLog) {
        const fields = node.fields.map(field => field.label)
        onLog(node, `Collected fields [${fields}] from page`)
    }

    let data: any = parsedFields
    if (node.append === true) {
        if (Array.isArray(data)) {
            if (!data.length) return

            const keys = Object.keys(data[0])

            keys.forEach(key => {
                input.passedData[key] = data.map((item: any) => item[key])
            })

            data = input.passedData
        } else {
            data = { ...parsedFields, ...input.passedData }
        }
    }

    if (onWatch && node.id === watchedNodeId) onWatch(data)

    return Promise.resolve({
        ...input,
        passedData: data
    })
}

export default collect
