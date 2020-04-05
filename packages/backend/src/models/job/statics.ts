import { Types } from 'mongoose'
import JobModel from '.'

export const getLatestJobs = function (
    this: JobModel,
    userId: string,
    limit: number,
    skip: number
) {
    // eslint-disable-next-line no-invalid-this
    return this.aggregate([
        {
            $match: {
                owner: new Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: 'workflows',
                localField: 'workflow',
                foreignField: '_id',
                as: 'workflow'
            }
        },
        {
            $unwind: {
                path: '$workflow',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'agendaJobs',
                localField: 'agendaJob',
                foreignField: '_id',
                as: 'agendaJob'
            }
        },
        {
            $unwind: {
                path: '$agendaJob',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $sort: {
                'agendaJob.nextRunAt': -1,
                'agendaJob.lastRunAt': -1,
                'agendaJob.lastFinishedAt': -1
            }
        },
        {
            $project: {
                id: '$_id',
                name: '$name',
                workflowId: '$workflow._id',
                workflowName: '$workflow.name',
                hasErrors: '$hasErrors',
                nextRun: '$agendaJob.nextRunAt',
                lastRun: '$agendaJob.lastRunAt',
                lastFinished: '$agendaJob.lastFinishedAt',
                interval: '$agendaJob.repeatInterval',
                nextRunAt: { $ifNull: ['$agendaJob.nextRunAt', 0] },
                lockedAt: { $ifNull: ['$agendaJob.lockedAt', 0] },
                lastRunAt: { $ifNull: ['$agendaJob.lastRunAt', 0] },
                lastFinishedAt: {
                    $ifNull: ['$agendaJob.lastFinishedAt', 0]
                },
                failedAt: { $ifNull: ['$agendaJob.failedAt', 0] },
                repeatInterval: {
                    $ifNull: ['$agendaJob.repeatInterval', 0]
                },
                disabled: '$agendaJob.disabled'
            }
        },
        {
            $project: {
                id: '$_id',
                name: '$name',
                workflowId: '$workflowId',
                workflowName: '$workflowName',
                nextRun: '$nextRun',
                lastRun: '$lastRun',
                lastFinished: '$lastFinished',
                repeatInterval: '$interval',
                hasErrors: '$hasErrors',
                status: {
                    running: {
                        $and: [
                            '$lastRunAt',
                            { $gt: ['$lastRunAt', '$lastFinishedAt'] }
                        ]
                    },
                    scheduled: {
                        $and: [
                            '$nextRunAt',
                            { $gte: ['$nextRunAt', new Date()] }
                        ]
                    },
                    queued: {
                        $and: [
                            '$nextRunAt',
                            { $gte: [new Date(), '$nextRunAt'] },
                            { $gte: ['$nextRunAt', '$lastFinishedAt'] }
                        ]
                    },
                    completed: {
                        $and: [
                            '$lastFinishedAt',
                            { $gt: ['$lastFinishedAt', '$failedAt'] }
                        ]
                    },
                    failed: {
                        $and: [
                            '$lastFinishedAt',
                            '$failedAt',
                            { $eq: ['$lastFinishedAt', '$failedAt'] }
                        ]
                    },
                    repeating: {
                        $and: [
                            '$repeatInterval',
                            { $ne: ['$repeatInterval', null] }
                        ]
                    },
                    paused: { $ifNull: ['$disabled', false] }
                }
            }
        },
        {
            $sort: {
                paused: 1
            }
        },
        { $limit: limit },
        { $skip: skip }
    ])
}
