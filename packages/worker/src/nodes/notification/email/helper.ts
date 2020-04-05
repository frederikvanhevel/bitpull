import { capitalize } from '../../../utils/text'
import { NodeInput, NodeType, UploadedFile } from '../../../typedefs/node'
import { FileError, NodeError } from '../../../nodes/common/errors'
import { assert } from '../../../utils/common'
import { EmailNode } from './typedefs'

export const getMessage = (input: NodeInput<EmailNode, UploadedFile>) => {
    const { parent, passedData } = input

    assert(parent, NodeError.NEEDS_PARENT)
    assert(passedData, FileError.FILE_MISSING)

    let message: string

    if (
        parent.type === NodeType.DROPBOX ||
        parent.type === NodeType.GOOGLE_DRIVE ||
        parent.type === NodeType.ONEDRIVE ||
        parent.type === NodeType.GITHUB
    ) {
        message = `File was successfully uploaded to ${capitalize(
            parent.type
        )}: <a href="${passedData.url}">${passedData.name}</a>`
    } else if (parent.type === NodeType.STORAGE) {
        message = `File was successfully stored: <a href="${passedData.url}">${passedData.name}</a>`
    } else if (parent.type === NodeType.WEBHOOK) {
        message = 'Request was sent to webhook'
    } else {
        message = 'Workflow notification'
    }

    return message
}
