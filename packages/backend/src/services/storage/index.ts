import { Types } from 'mongoose'
import addDays from 'date-fns/addDays'
import StorageModel, { Storage, ResourceType, Resource } from 'models/storage'
import S3 from 'components/s3'
import Logger from 'utils/logging/logger'
import { StorageService as DataService } from '@bitpull/worker'
import { NotFoundError, NotAllowedError } from 'utils/errors'
import { StorageLink } from 'typedefs/graphql'
import { User } from 'models/user'

const DATA_EXPIRY_DAYS: Record<ResourceType, number> = {
    [ResourceType.JOB]: 30,
    [ResourceType.TEST_RUN]: 1
}

const getExpiryDate = (payload: Resource) => {
    if (payload.data.service === DataService.NATIVE) {
        return addDays(new Date(), DATA_EXPIRY_DAYS[payload.resourceType])
    }

    return undefined
}

const save = async (owner: string, payload: Resource) => {
    const saved = await StorageModel.findOneAndUpdate(
        {
            resourceType: payload.resourceType,
            resourceId: payload.resourceId,
            resourceName: payload.resourceName,
            owner
        },
        {
            $push: {
                links: {
                    $each: [
                        {
                            ...payload.data,
                            expiryDate: getExpiryDate(payload),
                            createdAt: new Date()
                        }
                    ],
                    $position: 0
                }
            },
            $inc: { count: 1 },
            updatedAt: new Date()
        },
        { upsert: true, new: true }
    ).lean()

    if (!saved) {
        Logger.error(
            new Error(
                `Storage wasn't saved for resource ${payload.resourceType}:${payload.resourceId}`
            )
        )
    }

    return saved
}

const getEntry = async (
    user: User,
    storageId: string,
    offset: number = 0,
    limit: number = 10
): Promise<StorageLink[]> => {
    const entry = await StorageModel.findById(storageId)

    if (!entry) throw new NotFoundError()
    if (!entry.owner.equals(user.id)) {
        throw new NotAllowedError()
    }

    const result = await StorageModel.aggregate([
        { $match: { _id: Types.ObjectId(storageId) } },
        {
            $project: {
                _id: 0,
                links: { $slice: ['$links', offset, limit] }
            }
        }
    ])

    if (!result.length) throw new NotFoundError()

    return result[0].links
}

const getStorageLink = async (linkId: string) => {
    const entry = await StorageModel.findOne(
        { 'links._id': Types.ObjectId(linkId) },
        { 'links.$': 1 }
    )

    if (!entry || !entry.links.length) throw new NotFoundError()

    return entry.links[0]
}

const getEntries = async (
    user: User,
    resourceType: ResourceType
): Promise<Storage[]> => {
    return await StorageModel.find({
        owner: user._id,
        resourceType,
        links: { $exists: true, $not: { $size: 0 } }
    })
        .sort({ updatedAt: -1 })
        .select('-links')
        .lean()
}

const removeDataFromAws = async () => {
    const awsStorageToRemove: Storage[] = await StorageModel.aggregate([
        {
            $project: {
                links: {
                    $filter: {
                        input: '$links',
                        as: 'links',
                        cond: {
                            $and: [
                                {
                                    $eq: ['$$links.service', DataService.NATIVE]
                                },
                                { $lt: ['$$links.expiryDate', new Date()] }
                            ]
                        }
                    }
                }
            }
        }
    ])

    const flattenedLinks = awsStorageToRemove.flatMap(
        (storage: Storage) => storage.links
    )

    if (!flattenedLinks.length) return

    const result = await S3.deleteObjects(
        flattenedLinks.map(linkObj => linkObj.fileName)
    )

    if (result.Errors?.length) {
        const errors = JSON.stringify(result.Errors)
        Logger.throw(new Error('Could not delete s3 object'), new Error(errors))
    }
}

const clean = async () => {
    await removeDataFromAws()
}

const StorageService = {
    save,
    getEntry,
    getEntries,
    getStorageLink,
    clean
}

export default StorageService
