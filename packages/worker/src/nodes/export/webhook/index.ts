import { createReadStream } from 'fs'
import { CoreOptions } from 'request'
import request from 'request-promise-native'
import { FlowError } from '../../../utils/errors'
import { FileError } from '../../common/errors'
import { assert } from '../../../utils/common'
import { NodeParser } from '../../../typedefs/node'
import { isFileNode } from '../../../utils/helper'
import { FileWriteResult } from '../../../utils/file'
import Storage from '../../../nodes/common/storage'
import { WebhookNode } from './typedefs'
import { WebhookError } from './errors'

const webhook: NodeParser<WebhookNode> = async (input, options) => {
    const { onLog, settings } = options
    const { node, parent, passedData } = input

    assert(node.path, WebhookError.REQUEST_PATH_MISSING)

    // TODO might want to send extra meta data here
    let requestOptions: CoreOptions = {}
    if (parent && isFileNode(parent.type)) {
        const fileData = passedData as FileWriteResult

        assert(fileData && fileData.path, FileError.FILE_MISSING)

        requestOptions = {
            // headers: {
            //     'Content-Transfer-Encoding': passedData.encoding
            // },
            formData: {
                file: {
                    value: createReadStream(passedData.path, {
                        encoding: fileData.encoding
                    }),
                    options: {
                        filename: fileData.fileName,
                        contentType: fileData.contentType
                    }
                },
                filename: fileData.fileName
            }
        }
    } else {
        const data = await Storage.getChangedData(settings, node.id, passedData)

        requestOptions = {
            body: {
                data
            },
            json: true
        }
    }

    try {
        await request({
            uri: node.path,
            method: node.method || 'POST',
            ...requestOptions,
            headers: {
                userAgent: 'Bitpull/1.0'
            }
        })
    } catch (error) {
        throw new FlowError(WebhookError.REQUEST_FAILED, error)
    }

    if (onLog) onLog(node, `Successfully sent data to ${node.path}`)

    return input
}

export default webhook
