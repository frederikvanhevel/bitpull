import { Settings } from '../../../typedefs/common'
import Storage from '../storage'

const mockS3GetObject = jest.fn()
const mockS3PutObject = jest.fn()

jest.mock('aws-sdk', () => {
    return {
        S3: jest.fn(() => ({
            getObject: mockS3GetObject,
            putObject: mockS3PutObject
        }))
    }
})

describe('Storage', () => {
    const settings = {
        storage: {
            credentials: {
                bucket: 'mybucket',
                accessKeyId: 'key',
                secretAccessKey: 'secret'
            },
            changesOnly: true
        },
        metaData: {
            id: 'metadataid'
        }
    }

    it('should store the new data and return it if there was no history found', async () => {
        mockS3GetObject.mockImplementationOnce(() => {
            return {
                promise() {
                    return Promise.reject()
                }
            }
        })
        mockS3PutObject.mockImplementationOnce(() => {
            return {
                promise() {
                    return Promise.resolve()
                }
            }
        })

        const data = [
            {
                one: 1,
                two: 1,
                three: 1
            }
        ]

        const result = await Storage.getChangedData(
            settings as Settings,
            'nodeid',
            data
        )

        expect(mockS3GetObject).toHaveBeenCalledWith({
            Bucket: 'mybucket',
            Key: 'metadataid:nodeid'
        })
        expect(mockS3PutObject).toHaveBeenCalledWith({
            Body: '["38cf12d7e9a66f974cf7e1e0d2329498b55f4d45"]',
            Bucket: 'mybucket',
            ContentType: 'application/json; charset=utf-8',
            Key: 'metadataid:nodeid'
        })
        expect(result).toEqual(data)
    })

    it('should return and store the changes only when there was a history found', async () => {
        mockS3GetObject.mockImplementationOnce(() => {
            return {
                promise() {
                    return Promise.resolve({
                        Body: '["38cf12d7e9a66f974cf7e1e0d2329498b55f4d45"]'
                    })
                }
            }
        })
        mockS3PutObject.mockImplementationOnce(() => {
            return {
                promise() {
                    return Promise.resolve()
                }
            }
        })

        const data = [
            {
                one: 2,
                two: 2,
                three: 2
            },
            {
                one: 1,
                two: 1,
                three: 1
            }
        ]

        const result = await Storage.getChangedData(
            settings as Settings,
            'nodeid',
            data
        )

        expect(mockS3GetObject).toHaveBeenCalledWith({
            Bucket: 'mybucket',
            Key: 'metadataid:nodeid'
        })
        expect(mockS3PutObject).toHaveBeenCalledWith({
            Body:
                '["7827f8148e27affe073f1c5c5dedf4ac26175372","38cf12d7e9a66f974cf7e1e0d2329498b55f4d45"]',
            Bucket: 'mybucket',
            ContentType: 'application/json; charset=utf-8',
            Key: 'metadataid:nodeid'
        })
        expect(result).toEqual([
            {
                one: 2,
                two: 2,
                three: 2
            }
        ])
    })
})
