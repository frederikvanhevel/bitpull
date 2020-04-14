import { NodeParser, NodeInput } from '../../../typedefs/node'
import {
    FileType,
    FileEncoding,
    writeFile,
    getFileNameFromPath,
    FileWriteResult
} from '../../../utils/file'
import { assert } from '../../../utils/common'
import { NodeError, ParseError, FileError } from '../../common/errors'
import { HtmlParseResult } from '../html/typedefs'
import { absolutifyHtml } from '../../../utils/absolutify'
import { PdfNode, PdfFormat } from './typedefs'

const pdf: NodeParser<PdfNode, FileWriteResult> = async (
    input: NodeInput<PdfNode, undefined, HtmlParseResult>,
    options,
    context
) => {
    const { onLog, settings } = options
    const { browser } = context
    const { node, rootAncestor, parentResult } = input

    assert(rootAncestor, NodeError.NEEDS_ROOT_ANCESTOR)
    // assert(rootAncestor.parseJavascript, NEEDS_REAL_BROWSER);
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

        buffer = await page.pdf({
            landscape: node.landscape || false,
            format: node.format || PdfFormat.A4
        })
    }, settings)

    assert(buffer, FileError.BUFFER_EMPTY)

    const path = await writeFile(buffer, FileType.PDF, FileEncoding.BINARY)

    if (onLog) onLog(node, 'Succesfully converted to pdf file')

    return Promise.resolve({
        ...input,
        passedData: {
            path,
            fileName: getFileNameFromPath(path),
            encoding: FileEncoding.BINARY,
            contentType: 'application/pdf'
        }
    })
}

export default pdf
