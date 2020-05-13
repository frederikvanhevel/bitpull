import subMonths from 'date-fns/subMonths'
import subWeeks from 'date-fns/subWeeks'
import AnalyticsModel from 'models/analytics'
import { Job } from 'models/job'
import { Status, Stats } from '@bitpull/worker'
import { User } from 'models/user'
import { AnalyticsPeriod } from './typedefs'

const getTotalsForPeriod = async (
    user: User,
    period: AnalyticsPeriod = AnalyticsPeriod.LAST_WEEK
) => {
    let date = new Date()

    if (period === AnalyticsPeriod.LAST_MONTH) {
        date = subMonths(date, 1)
    } else {
        date = subWeeks(date, 1)
    }

    return (
        await AnalyticsModel.getAnalyticsForPeriod(user._id, date)
    ).map(row => ({ ...row, date: new Date(row.date) }))
}

const getTotalsPerJob = async (
    user: User,
    period: AnalyticsPeriod = AnalyticsPeriod.LAST_WEEK
) => {
    let date = new Date()

    if (period === AnalyticsPeriod.LAST_MONTH) {
        date = subMonths(date, 1)
    } else {
        date = subWeeks(date, 1)
    }

    const result = await AnalyticsModel.getAnalyticsPerJob(user._id, date)

    return result
        .filter(analytics => !!analytics.job)
        .map(analytics => ({
            ...analytics,
            job: { id: analytics.job._id, ...analytics.job }
        }))
}

const save = async (job: Job, status: Status, stats: Stats) => {
    const analyticsEntry = new AnalyticsModel({
        job: job._id,
        status,
        duration: stats.duration,
        pages: stats.pageCount,
        owner: job.owner,
        date: new Date()
    })

    await analyticsEntry.save()
}

const clean = async () => {
    const twoMonthsAgo = subMonths(new Date(), 2)

    await AnalyticsModel.deleteMany({
        date: { $lte: twoMonthsAgo }
    })
}

const AnalyticsService = {
    getTotalsForPeriod,
    getTotalsPerJob,
    save,
    clean
}

export default AnalyticsService
