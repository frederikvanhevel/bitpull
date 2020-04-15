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
import { CsvNode } from './typedefs'
import { CsvError } from './errors'

const csv: NodeParser<CsvNode, FileWriteResult> = async (input, options) => {
    const { onLog } = options
    const { node, passedData } = input

    let path
    try {
        const csvData = await convertToCsv(passedData)
        path = await writeFile(csvData, FileType.CSV, FileEncoding.UTF8)
    } catch (error) {
        throw new FlowError(CsvError.COULD_NOT_CREATE)
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
