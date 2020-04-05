import AWS from 'aws-sdk'

const instance = new AWS.S3()

const deleteObjects = async (links: string[]) => {
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
}

const S3 = {
    deleteObjects
}

export default S3
