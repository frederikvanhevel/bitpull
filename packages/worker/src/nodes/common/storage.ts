import { createReadStream } from 'fs'
import AWS from 'aws-sdk'
import hash from 'object-hash'
import { StorageSettings, Settings } from '../../typedefs/common'
import { assert } from '../../utils/common'
import Logger from '../../utils/logging/logger'
import { compare } from '../../utils/compare'

const store = async (
    settings: StorageSettings,
    key: string,
    filePath: string
) => {
    assert(settings && settings.credentials)

    const { credentials } = settings

    const params: AWS.S3.PutObjectRequest = {
        Bucket: credentials.bucket,
        Key: key,
        Body: createReadStream(filePath)
    }

    const s3 = new AWS.S3({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey
    })

    return await s3.upload(params).promise()
}

const storeHistory = async (
    settings: StorageSettings,
    key: string,
    data: object | object[]
) => {
    assert(settings && settings.credentials)

    const { credentials } = settings
    const hashed = Array.isArray(data)
        ? data.map(item => hash(item))
        : hash(data)

    const params: AWS.S3.PutObjectRequest = {
        Bucket: credentials.bucket,
        Key: key,
        Body: JSON.stringify(hashed),
        ContentType: 'application/json; charset=utf-8'
    }

    const s3 = new AWS.S3({
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey
    })

    await s3.putObject(params).promise()
}

const getChangedData = async (
    settings: Settings,
    nodeId: string,
    data: object | object[]
): Promise<object | object[]> => {
    try {
        const { storage, metaData } = settings

        if (!storage?.changesOnly) return data

        assert(storage && storage.credentials)
        assert(metaData && metaData.id)

        const { credentials } = storage
        const key = `${metaData.id}:${nodeId}`
        const params: AWS.S3.GetObjectRequest = {
            Bucket: storage.credentials.bucket,
            Key: key
        }

        const s3 = new AWS.S3({
            accessKeyId: credentials.accessKeyId,
            secretAccessKey: credentials.secretAccessKey
        })

        try {
            const history = await s3.getObject(params).promise()

            if (!history?.Body) throw new Error()

            return compare(JSON.parse(history.Body.toString()), data)
        } catch (error) {
            return data
        } finally {
            try {
                await storeHistory(storage, key, data)
            } catch (error) {} // eslint-disable-line no-empty
        }
    } catch (error) {
        Logger.error(new Error('Could not compare data'), error)
        return data
    }
}

const Storage = {
    store,
    getChangedData
}

export default Storage
