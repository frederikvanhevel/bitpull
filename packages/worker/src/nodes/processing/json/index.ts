import { NodeParser } from '../../../typedefs/node'
import {
    FileType,
    writeFile,
    getFileNameFromPath,
    FileWriteResult
} from '../../../utils/file'
import { assert } from '../../../utils/common'
import { hasChildExportNodes, hasResult } from '../../../utils/helper'
import { NodeError } from '../../../nodes/common/errors'
import Storage from '../../../nodes/common/storage'
import { JsonNode } from './typedefs'

const json: NodeParser<JsonNode, FileWriteResult> = async (input, options) => {
    const { onLog, settings } = options
    const { node, passedData } = input

    assert(hasChildExportNodes(node), NodeError.EXPORT_NODE_MISSING)

    const data = await Storage.getChangedData(settings, node.id, passedData)

    if (!data || !hasResult(data)) {
        if (onLog) onLog(node, 'Nothing to save, skipping next step')
        node.skipChildren = true
        return input
    }

    const path = await writeFile(JSON.stringify(data, null, 4), FileType.JSON)

    if (onLog) onLog(node, 'Succesfully converted to json file')

    return Promise.resolve({
        ...input,
        passedData: {
            path,
            fileName: getFileNameFromPath(path),
            contentType: 'application/json'
        }
    })
}

export default json
