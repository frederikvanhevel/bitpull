import {
    FileType,
    FileEncoding,
    writeFile,
    getFileNameFromPath,
    FileWriteResult
} from '../../../utils/file'
import { NodeParser, NodeInput } from '../../../typedefs/node'
import { assert } from '../../../utils/common'
import { NodeError, FileError } from '../../common/errors'
import { HtmlParseResult } from '../html/typedefs'
import { hasChildExportNodes } from '../../../utils/helper'
import { ScreenshotNode } from './typedefs'

const screenshot: NodeParser<ScreenshotNode, FileWriteResult> = async (
    input: NodeInput<ScreenshotNode, undefined, HtmlParseResult>,
    options,
    context
) => {
    const { settings, onLog } = options
    const { browser } = context
    const { node, rootAncestor, page } = input

    assert(hasChildExportNodes(node), NodeError.EXPORT_NODE_MISSING)
    assert(rootAncestor, NodeError.NEEDS_ROOT_ANCESTOR)

    let buffer
    await browser.with(
        async page => {
            buffer = await page.screenshot({
                fullPage: node.fullPage || false
            })
        },
        settings,
        page
    )

    assert(buffer, FileError.BUFFER_EMPTY)

    const path = await writeFile(buffer, FileType.PNG, FileEncoding.BINARY)

    if (onLog) onLog(node, 'Succesfully saved screenshot')

    return Promise.resolve({
        ...input,
        passedData: {
            path,
            fileName: getFileNameFromPath(path),
            encoding: FileEncoding.BINARY,
            contentType: 'image/png'
        }
    })
}

export default screenshot
