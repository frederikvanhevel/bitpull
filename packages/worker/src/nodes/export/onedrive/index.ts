import { createReadStream } from 'fs'
import request from 'request-promise-native'
import { FlowError } from '../../../utils/errors'
import { FileWriteResult } from '../../../utils/file'
import { NodeParser, UploadedFile, NodeInput } from '../../../typedefs/node'
import { assert } from '../../../utils/common'
import { IntegrationType, StorageService } from '../../../typedefs/common'
import { FileError, IntegrationError } from '../../common/errors'
import { OnedriveNode } from './typedefs'
import { OneDriveError } from './errors'

const onedrive: NodeParser<OnedriveNode> = async (
    input: NodeInput<OnedriveNode, FileWriteResult>,
    options
) => {
    const { integrations = [], onStorage, onLog } = options
    const { node, passedData } = input

    const oneDriveIntegration = integrations.find(
        integration => integration.type === IntegrationType.ONEDRIVE
    )

    assert(passedData && passedData.path, FileError.INVALID_FILE_PATH)
    assert(passedData && passedData.fileName, FileError.INVALID_FILE_NAME)
    assert(oneDriveIntegration, IntegrationError.INTEGRATION_MISSING)
    assert(oneDriveIntegration.active, IntegrationError.INTEGRATION_INACTIVE)
    assert(
        oneDriveIntegration.settings.access_token,
        IntegrationError.ACCESS_TOKEN_MISSING
    )

    const fileContents = createReadStream(passedData.path)
    const fileName = node.filename || passedData.fileName

    // upload file
    let result
    try {
        result = await request({
            uri: `https://graph.microsoft.com/v1.0/drive/root:/${fileName}:/content`,
            method: 'PUT',
            body: fileContents,
            encoding: passedData.encoding === 'binary' ? null : 'utf8',
            headers: {
                Authorization: `Bearer ${oneDriveIntegration.settings.access_token}`,
                'Content-Type': passedData.contentType
            }
        })
    } catch (error) {
        throw new FlowError(OneDriveError.UPLOAD_FAILED, error)
    }

    const response = JSON.parse(result)

    if (onLog) {
        onLog(node, `File successfully uploaded to OneDrive: ${fileName}`)
    }

    if (onStorage) {
        onStorage({
            service: StorageService.ONEDRIVE,
            fileName: response.name,
            url: response.webUrl,
            contentType: passedData.contentType
        })
    }

    return {
        ...input,
        passedData: {
            name: response.name,
            url: response.webUrl
        } as UploadedFile
    }
}

export default onedrive
