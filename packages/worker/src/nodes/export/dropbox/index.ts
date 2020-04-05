import { createReadStream } from 'fs'
import request from 'request-promise-native'
import { FileError, IntegrationError } from '../../common/errors'
import { NodeParser, NodeInput, UploadedFile } from '../../../typedefs/node'
import { assert } from '../../../utils/common'
import { validateFilePath, FileWriteResult } from '../../../utils/file'
import { IntegrationType, StorageService } from '../../../typedefs/common'
import { FlowError } from '../../../utils/errors'
import { DropboxNode, DropboxArgs } from './typedefs'
import { DropboxError } from './errors'

const DROPBOX_UPLOAD_URL = 'https://content.dropboxapi.com/2/files/upload'
const DROPBOX_SHARED_LINK_URL =
    'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings'

const dropbox: NodeParser<DropboxNode> = async (
    input: NodeInput<DropboxNode, FileWriteResult>,
    options
) => {
    const { integrations = [], onLog, onStorage } = options
    const { node, passedData } = input

    const dropboxIntegration = integrations.find(
        integration => integration.type === IntegrationType.DROPBOX
    )

    assert(passedData && passedData.path, FileError.INVALID_FILE_PATH)
    assert(passedData && passedData.fileName, FileError.INVALID_FILE_NAME)
    assert(dropboxIntegration, IntegrationError.INTEGRATION_MISSING)
    assert(dropboxIntegration.active, IntegrationError.INTEGRATION_INACTIVE)
    assert(
        dropboxIntegration.settings.access_token,
        IntegrationError.ACCESS_TOKEN_MISSING
    )

    if (node.useDirectory) {
        assert(validateFilePath(node.directory), FileError.INVALID_DIRECTORY)
    }

    const fileContents = createReadStream(passedData.path)
    const directory = node.useDirectory ? node.directory : '/'
    const fileName = node.filename || passedData.fileName
    const dropBoxPath = `${directory}${fileName}`
    const dropboxArgs: DropboxArgs = {
        // TODO change file name
        path: dropBoxPath,
        mode: node.overwrite ? 'overwrite' : 'add',
        autorename: true,
        mute: false
    }

    // upload file
    try {
        await request({
            uri: DROPBOX_UPLOAD_URL,
            method: 'POST',
            body: fileContents,
            encoding: passedData.encoding === 'binary' ? null : 'utf8',
            headers: {
                Authorization: `Bearer ${dropboxIntegration.settings.access_token}`,
                'Content-Type': 'application/octet-stream',
                'Dropbox-API-Arg': JSON.stringify(dropboxArgs)
            }
        })
    } catch (error) {
        throw new FlowError(DropboxError.UPLOAD_FAILED)
    }

    if (onLog) onLog(node, `File successfully uploaded to Dropbox: ${fileName}`)

    if ((node.children && node.children.length) || onStorage) {
        // get shared link
        const result = await request({
            uri: DROPBOX_SHARED_LINK_URL,
            method: 'POST',
            body: {
                path: dropBoxPath,
                settings: { requested_visibility: 'public' }
            },
            json: true,
            headers: {
                Authorization: `Bearer ${dropboxIntegration.settings.access_token}`,
                'Content-Type': 'application/json'
            }
        })

        if (onStorage) {
            onStorage({
                service: StorageService.DROPBOX,
                fileName: result.name,
                url: result.url,
                contentType: passedData.contentType
            })
        }

        return {
            ...input,
            passedData: {
                name: result.name,
                url: result.url,
                previewType: result.preview_type
            } as UploadedFile
        }
    }

    return input
}

export default dropbox
