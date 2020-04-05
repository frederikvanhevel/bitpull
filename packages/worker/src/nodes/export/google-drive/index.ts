import { createReadStream } from 'fs'
import request from 'request-promise-native'
import { FileWriteResult } from '../../../utils/file'
import { NodeParser, NodeInput, UploadedFile } from '../../../typedefs/node'
import { assert } from '../../../utils/common'
import { IntegrationType, StorageService } from '../../../typedefs/common'
import { FileError, IntegrationError } from '../../common/errors'
import { GoogleDriveNode } from './typedefs'

const GOOGLE_DRIVE_UPLOAD_URL =
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart'

const googleDrive: NodeParser<GoogleDriveNode> = async (
    input: NodeInput<GoogleDriveNode, FileWriteResult>,
    options
) => {
    const { integrations = [], onStorage, onLog } = options
    const { node, passedData } = input

    const googleDriveIntegration = integrations.find(
        integration => integration.type === IntegrationType.GOOGLE_DRIVE
    )

    assert(passedData && passedData.path, FileError.INVALID_FILE_PATH)
    assert(passedData && passedData.fileName, FileError.INVALID_FILE_NAME)
    assert(googleDriveIntegration, IntegrationError.INTEGRATION_MISSING)
    assert(googleDriveIntegration.active, IntegrationError.INTEGRATION_INACTIVE)
    assert(
        googleDriveIntegration.settings.access_token,
        IntegrationError.ACCESS_TOKEN_MISSING
    )

    const fileContents = createReadStream(passedData.path)
    const fileName = node.filename || passedData.fileName

    // @ts-ignore
    const result = await request({
        uri: GOOGLE_DRIVE_UPLOAD_URL,
        method: 'POST',
        preambleCRLF: true,
        postambleCRLF: true,
        multipart: [
            {
                'content-type': 'application/json',
                body: JSON.stringify({
                    name: fileName,
                    _attachments: {
                        [fileName]: {
                            follows: true,
                            content_type: passedData.contentType
                        }
                    }
                })
            },
            { body: fileContents }
        ],
        json: true,
        headers: {
            Authorization: `Bearer ${googleDriveIntegration.settings.access_token}`
        }
    })

    if (onLog)
        onLog(node, `File successfully uploaded to Google Drive: ${fileName}`)

    if ((node.children && node.children.length) || onStorage) {
        // get shared link
        const link = await request({
            uri: `https://www.googleapis.com/drive/v3/files/${result.id}?fields=webViewLink`,
            method: 'GET',
            json: true,
            headers: {
                Authorization: `Bearer ${googleDriveIntegration.settings.access_token}`
            }
        })

        if (onStorage) {
            onStorage({
                service: StorageService.GOOGLE_DRIVE,
                fileName: result.name,
                url: link.webViewLink,
                contentType: passedData.contentType
            })
        }

        return {
            ...input,
            passedData: {
                name: result.name,
                url: link.webViewLink
            } as UploadedFile
        }
    }

    return input
}

export default googleDrive
