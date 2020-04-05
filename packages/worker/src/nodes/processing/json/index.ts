import { NodeParser } from '../../../typedefs/node'
import {
    FileType,
    writeFile,
    getFileNameFromPath,
    FileWriteResult
} from '../../../utils/file'
import { JsonNode } from './typedefs'

const json: NodeParser<JsonNode, FileWriteResult> = async (input, options) => {
    const { onLog } = options
    const { node, passedData } = input

    const path = await writeFile(
        JSON.stringify(passedData, null, 4),
        FileType.JSON
    )

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
