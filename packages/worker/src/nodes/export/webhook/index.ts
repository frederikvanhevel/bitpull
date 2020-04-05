import { createReadStream } from 'fs'
import { CoreOptions } from 'request'
import request from 'request-promise-native'
import { FileError } from '../../common/errors'
import { assert } from '../../../utils/common'
import { NodeParser, NodeInput } from '../../../typedefs/node'
import { isFileNode } from '../../../utils/helper'
import { FileWriteResult } from '../../../utils/file'
import { WebhookNode } from './typedefs'
import { WebhookError } from './errors'

const webhook: NodeParser<WebhookNode> = async (
    input: NodeInput<WebhookNode, FileWriteResult>,
    options
) => {
    const { onLog } = options
    const { node, parent, passedData } = input

    assert(node.path, WebhookError.REQUEST_PATH_MISSING)
    assert(passedData, FileError.FILE_MISSING)

    // TODO might want to send extra meta data here
    let requestOptions: CoreOptions = {}
    if (parent && isFileNode(parent.type)) {
        requestOptions = {
            // headers: {
            //     'Content-Transfer-Encoding': passedData.encoding
            // },
            formData: {
                file: {
                    value: createReadStream(passedData.path, {
                        encoding: passedData.encoding
                    }),
                    options: {
                        filename: passedData.fileName,
                        contentType: passedData.contentType
                    }
                },
                filename: passedData.fileName
            }
        }
    } else {
        requestOptions = {
            body: {
                data: passedData
            },
            json: true
        }
    }

    await request({
        uri: node.path,
        method: node.method || 'POST',
        ...requestOptions,
        headers: {
            userAgent: 'Bitpull/1.0'
        }
    })

    if (onLog) onLog(node, `Successfully sent data to ${node.path}`)

    return Promise.resolve(input)
}

export default webhook
