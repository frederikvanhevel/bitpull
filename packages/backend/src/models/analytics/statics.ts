import { Types } from 'mongoose'
import { Status } from '@bitpull/worker'
import JobModel, { Job } from 'models/job'
import AnalyticsModel from '.'

export interface GetAnalyticsForPeriodResult {
    date: Date
    completed: number
    failed: number
    total: number
}

export const getAnalyticsForPeriod = function (
    this: AnalyticsModel,
    userId: string,
    date: Date
) {
    // eslint-disable-next-line no-invalid-this
    return this.aggregate([
        {
            $match: {
                date: { $gte: date },
                owner: new Types.ObjectId(userId)
            }
        },
        {
            $project: {
                _id: null,
                date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
                status: '$status'
            }
        },
        {
            $group: {
                _id: '$date',
                completed: {
                    $sum: {
                        $cond: {
                            if: { $eq: ['$status', Status.SUCCESS] },
                            then: 1,
                            else: 0
                        }
                    }
                },
                partial: {
                    $sum: {
                        $cond: {
                            if: { $eq: ['$status', Status.PARTIAL_SUCCESS] },
                            then: 1,
                            else: 0
                        }
                    }
                },
                failed: {
                    $sum: {
                        $cond: {
                            if: {
                                $or: [
                                    { $eq: ['$status', Status.ERROR] },
                                    { $eq: ['$status', Status.PARTIAL_SUCCESS] }
                                ]
                            },
                            then: 1,
                            else: 0
                        }
                    }
                },
                total: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: null,
                date: '$_id',
                completed: '$completed',
                failed: '$failed',
                total: '$total'
            }
        },
        {
            $sort: {
                date: 1
            }
        }
    ])
}

export interface getAnalyticsPerJobResult {
    job: Job
    completed: number
    failed: number
    total: number
}

export const getAnalyticsPerJob = function (
    this: AnalyticsModel,
    userId: string,
    date: Date
) {
    // eslint-disable-next-line no-invalid-this
    return this.aggregate([
        {
            $match: {
                date: { $gte: date },
                owner: new Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: JobModel.collection.name,
                localField: 'job',
                foreignField: '_id',
                as: 'job'
            }
        },
        {
            $unwind: {
                path: '$job',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: '$job',
                completed: {
                    $sum: {
                        $cond: {
                            if: { $eq: ['$status', Status.SUCCESS] },
                            then: 1,
                            else: 0
                        }
                    }
                },
                failed: {
                    $sum: {
                        $cond: {
                            if: {
                                $or: [
                                    { $eq: ['$status', Status.ERROR] },
                                    { $eq: ['$status', Status.PARTIAL_SUCCESS] }
                                ]
                            },
                            then: 1,
                            else: 0
                        }
                    }
                },
                total: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: null,
                job: '$_id',
                completed: '$completed',
                failed: '$failed',
                total: '$total'
            }
        },
        {
            $sort: {
                failed: -1,
                completed: -1
            }
        }
    ])
}
