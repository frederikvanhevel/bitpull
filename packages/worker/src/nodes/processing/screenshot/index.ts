import {
    FileType,
    FileEncoding,
    writeFile,
    getFileNameFromPath,
    FileWriteResult
} from '../../../utils/file'
import { NodeParser, NodeInput } from '../../../typedefs/node'
import { assert } from '../../../utils/common'
import { NodeError, FileError, ParseError } from '../../common/errors'
import { HtmlParseResult } from '../html/typedefs'
import { absolutifyHtml } from '../../../utils/helper'
import { ScreenshotNode } from './typedefs'

const screenshot: NodeParser<ScreenshotNode, FileWriteResult> = async (
    input: NodeInput<ScreenshotNode, undefined, HtmlParseResult>,
    options,
    context
) => {
    const { settings, onLog } = options
    const { browser } = context
    const { node, rootAncestor, parentResult } = input

    assert(rootAncestor, NodeError.NEEDS_ROOT_ANCESTOR)
    assert(
        rootAncestor.parsedLink || parentResult!.html,
        ParseError.LINK_MISSING
    )

    let buffer
    await browser.with(async page => {
        if (parentResult && parentResult.html) {
            const displayHtml = absolutifyHtml(
                parentResult.html,
                parentResult.url,
                settings.proxyEndpoint
            )
            await page.setContent(displayHtml)
        } else await page.goto(rootAncestor!.parsedLink!)

        buffer = await page.screenshot({
            fullPage: node.fullPage || false
        })
    }, settings)

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
