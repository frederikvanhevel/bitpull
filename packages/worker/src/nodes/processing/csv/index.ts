import { NodeParser } from '../../../typedefs/node'
import {
    FileType,
    FileEncoding,
    writeFile,
    getFileNameFromPath,
    FileWriteResult,
    convertToCsv
} from '../../../utils/file'
import { FlowError } from '../../../utils/errors'
import { assert } from '../../../utils/common'
import { hasChildExportNodes, hasResult } from '../../../utils/helper'
import { NodeError } from '../../../nodes/common/errors'
import Storage from '../../../nodes/common/storage'
import { CsvNode } from './typedefs'
import { CsvError } from './errors'

const csv: NodeParser<CsvNode, FileWriteResult> = async (input, options) => {
    const { onLog, settings } = options
    const { node, passedData } = input

    assert(hasChildExportNodes(node), NodeError.EXPORT_NODE_MISSING)

    const data = await Storage.getChangedData(settings, node.id, passedData)

    if (!data || !hasResult(data)) {
        if (onLog) onLog(node, 'Nothing to save, skipping next step')
        node.skipChildren = true
        return input
    }

    let path
    try {
        const csvData = await convertToCsv(Array.isArray(data) ? data : [data])
        path = await writeFile(csvData, FileType.CSV, FileEncoding.UTF8)
    } catch (error) {
        throw new FlowError(CsvError.COULD_NOT_CREATE_CSV, error)
    }

    if (onLog) onLog(node, 'Succesfully converted to csv file')

    return Promise.resolve({
        ...input,
        passedData: {
            path,
            fileName: getFileNameFromPath(path),
            encoding: FileEncoding.UTF8,
            contentType: 'text/csv'
        }
    })
}

export default csv
