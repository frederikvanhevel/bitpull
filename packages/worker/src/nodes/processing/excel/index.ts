import json2xls from 'p3x-json2xls-worker-thread'
import { NodeParser } from '../../../typedefs/node'
import {
    FileType,
    FileEncoding,
    writeFile,
    getFileNameFromPath,
    FileWriteResult
} from '../../../utils/file'
import { FlowError } from '../../../utils/errors'
import { ExcelNode } from './typedefs'
import { ExeclError } from './errors'

const excel: NodeParser<ExcelNode, FileWriteResult> = async (
    input,
    options
) => {
    const { onLog } = options
    const { node, passedData } = input

    let path
    try {
        const excelData = await json2xls(passedData)
        path = await writeFile(excelData, FileType.EXCEL, FileEncoding.BINARY)
    } catch (error) {
        throw new FlowError(ExeclError.COULD_NOT_CREATE)
    }

    if (onLog) onLog(node, 'Succesfully converted to excel file')

    return Promise.resolve({
        ...input,
        passedData: {
            path,
            fileName: getFileNameFromPath(path),
            encoding: FileEncoding.BINARY,
            contentType:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
    })
}

export default excel
