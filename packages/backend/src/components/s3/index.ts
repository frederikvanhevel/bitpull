import AWS from 'aws-sdk'
import Logger from 'utils/logging/logger'

const instance = new AWS.S3()

const deleteObjects = async (links: string[]) => {
    try {
        const params: AWS.S3.Types.DeleteObjectsRequest = {
            Bucket: process.env.AWS_S3_BUCKET!,
            Delete: {
                Objects: links.map(link => ({
                    Key: link
                })),
                Quiet: false
            }
        }

        return await instance.deleteObjects(params).promise()
    } catch (error) {
        Logger.throw(new Error('Could not delete object on S3'), error)
    }
}

const S3 = {
    deleteObjects
}

export default S3
