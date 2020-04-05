import { capitalize } from '../../../utils/text'
import {
    NodeInput,
    NodeType,
    TraverseOptions,
    UploadedFile
} from '../../../typedefs/node'
import { StorageProvider } from '../../../typedefs/common'
import { assert } from '../../../utils/common'
import { NodeError, FileError } from '../../../nodes/common/errors'
import { SlackNode, SlackMessage } from './typedefs'

export const getMessage = (
    input: NodeInput<SlackNode, UploadedFile>,
    options: TraverseOptions
) => {
    const { settings } = options
    const { parent, passedData } = input

    assert(parent, NodeError.NEEDS_PARENT)
    assert(passedData, FileError.FILE_MISSING)

    let message: SlackMessage

    if (
        parent.type === NodeType.DROPBOX ||
        parent.type === NodeType.GOOGLE_DRIVE ||
        parent.type === NodeType.ONEDRIVE ||
        parent.type === NodeType.GITHUB
    ) {
        message = {
            attachments: [
                {
                    fallback: `File was successfully uploaded to ${capitalize(
                        parent.type
                    )}:`,
                    pretext: `File was successfully uploaded to ${capitalize(
                        parent.type
                    )}:`,
                    title: passedData.name,
                    title_link: passedData.url
                }
            ]
        }
    } else if (parent.type === NodeType.STORAGE) {
        message = {
            attachments: [
                {
                    fallback: 'File was successfully stored',
                    pretext: 'File was successfully stored:',
                    title:
                        settings?.storage?.provider === StorageProvider.AMAZON
                            ? passedData.url
                            : passedData.name,
                    title_link: passedData.url
                }
            ]
        }
    } else if (parent.type === NodeType.WEBHOOK) {
        message = {
            text: 'Request sent to webhook.'
        }
    } else {
        message = {
            text: 'Completed successfully.'
        }
    }

    return message
}
