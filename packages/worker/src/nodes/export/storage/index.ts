import Storage from '../../../nodes/common/storage'
import { FlowError } from '../../../utils/errors'
import { FileError, NodeError } from '../../common/errors'
import { NodeParser, UploadedFile, NodeInput } from '../../../typedefs/node'
import { assert } from '../../../utils/common'
import { isFileNode } from '../../../utils/helper'
import {
    Settings,
    StorageProvider,
    StorageObject,
    StorageService
} from '../../../typedefs/common'
import { FileWriteResult } from '../../../utils/file'
import { StorageNode } from './typedefs'
import { StorageError } from './errors'

const usesStorage = (settings?: Settings) => {
    return (
        settings &&
        settings.storage &&
        settings.storage.provider !== StorageProvider.NONE
    )
}

const storage: NodeParser<StorageNode> = async (
    input: NodeInput<StorageNode, FileWriteResult>,
    options
) => {
    const { settings, onLog, onStorage } = options
    const { node, parent, passedData } = input

    // if onStorage is undefined, don't actually store anything
    if (!usesStorage(settings)) {
        return {
            ...input,
            passedData: {
                name: '<<Storage not available>>',
                url: 'https://bitpull.io'
            } as UploadedFile
        }
    }

    const storage = settings!.storage!

    assert(storage && storage.credentials, StorageError.STORAGE_OPTIONS_MISSING)
    assert(storage.credentials.bucket, StorageError.AWS_BUCKET_MISSING)
    assert(
        storage.credentials.accessKeyId,
        StorageError.AWS_ACCESS_KEY_ID_MISSING
    )
    assert(
        storage.credentials.secretAccessKey,
        StorageError.AWS_SECRET_ACCESS_KEY_MISSING
    )
    assert(parent, NodeError.NEEDS_PARENT)
    assert(isFileNode(parent.type), StorageError.INVALID_PARENT_TYPE)
    assert(passedData && passedData.path, FileError.INVALID_FILE_PATH)
    assert(passedData && passedData.fileName, FileError.INVALID_FILE_NAME)

    let result
    try {
        result = await Storage.store(
            storage,
            passedData.fileName,
            passedData.path
        )
    } catch (error) {
        throw new FlowError(StorageError.STORAGE_FAILED, error)
    }

    if (onLog) onLog(node, `File successfully stored: ${passedData.fileName}`)
    if (onStorage) {
        onStorage({
            service: StorageService.NATIVE,
            fileName: passedData.fileName,
            url: result.Location,
            contentType: passedData.contentType
        } as StorageObject)
    }

    return {
        ...input,
        passedData: {
            name: passedData.fileName,
            url: result.Location
        } as UploadedFile
    }
}

export default storage
