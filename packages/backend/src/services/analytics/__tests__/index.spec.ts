import { mocked } from 'ts-jest/utils'
import AnalyticsModel from 'models/analytics'
import { UserFactory } from 'models/user/__mocks__/user.mock'
import { JobFactory } from 'models/job/__mocks__/job.mock'
import { Status } from '@bitpull/worker'
import MockDate from 'mockdate'
import AnalyticsService from '../index'
import { AnalyticsPeriod } from '../typedefs'

jest.mock('models/analytics')
const mockedAnalyticsModel = mocked(AnalyticsModel)

describe('Analytics service', () => {
    beforeAll(() => {
        MockDate.set('2019-04-07T10:20:30Z')
    })

    afterAll(() => {
        MockDate.reset()
    })

    it('should get analytics for a period', async () => {
        const user = UserFactory.getSingleRecord()

        const entry = {
            date: new Date('2020-03-22T18:10:22.528Z'),
            completed: 5,
            failed: 2,
            total: 7
        }

        mockedAnalyticsModel.getAnalyticsForPeriod.mockResolvedValueOnce([
            entry
        ])

        const result = await AnalyticsService.getTotalsForPeriod(
            user,
            AnalyticsPeriod.LAST_WEEK
        )

        expect(result).toEqual([entry])
    })

    it('should get analytics per job', async () => {
        const user = UserFactory.getSingleRecord()

        const entry = {
            job: JobFactory.getSingleRecord(),
            completed: 5,
            failed: 2,
            total: 7
        }

        mockedAnalyticsModel.getAnalyticsPerJob.mockResolvedValueOnce([entry])

        const result = await AnalyticsService.getTotalsPerJob(
            user,
            AnalyticsPeriod.LAST_WEEK
        )

        expect(result).toEqual([entry])
    })

    it('should save analytics', async () => {
        const job = JobFactory.getSingleRecord()
        await AnalyticsService.save(job, Status.SUCCESS, 5)

        expect(mockedAnalyticsModel).toHaveBeenCalledWith({
            job: job._id,
            status: Status.SUCCESS,
            duration: 5,
            owner: job.owner,
            date: new Date('2019-04-07T10:20:30Z')
        })
        // @ts-ignore
        expect(mockedAnalyticsModel.prototype.save).toHaveBeenCalled()
    })

    it('should clean analytics data', async () => {
        await AnalyticsService.clean()

        expect(mockedAnalyticsModel.deleteMany).toHaveBeenCalledWith({
            date: { $lte: new Date('2019-02-07T11:20:30Z') }
        })
    })
})
