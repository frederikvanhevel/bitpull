import faker from 'faker'
import { mocked } from 'ts-jest/utils'
import JobModel from 'models/job'
import { UserFactory } from 'models/user/__mocks__/user.mock'
import { LimitReachedError } from 'utils/errors'
import Scheduler from 'components/scheduler'
import { ScheduleType } from '../typedefs'
import JobService, { JOB_LIMIT } from '..'

jest.mock('models/job')
const mockedJobModel = mocked(JobModel)

jest.mock('components/scheduler')
const mockedScheduler = mocked(Scheduler)

describe('Job service', () => {
    it('should get jobs', async () => {
        const user = UserFactory.getSingleRecord()

        await JobService.getJobs(user)

        expect(mockedJobModel.getLatestJobs).toHaveBeenCalledWith(
            user._id,
            50,
            0
        )
    })

    describe('Job creation', () => {
        it('should not create a job when over limit', async () => {
            const user = UserFactory.getSingleRecord()

            mockedJobModel.countDocuments.mockResolvedValueOnce(JOB_LIMIT + 1)

            await expect(
                JobService.createJob(
                    user,
                    faker.random.word(),
                    faker.random.uuid(),
                    ScheduleType.ONCE,
                    '2020-04-04'
                )
            ).rejects.toThrowError(LimitReachedError)
        })

        it('should create a one time run job', async () => {
            const user = UserFactory.getSingleRecord()
            const name = faker.random.word()
            const id = faker.random.uuid()
            const workflow = faker.random.uuid()
            const schedule = '2020-04-04'
            const agendaJob = {
                attrs: {
                    _id: id
                }
            }
            const save = jest.fn()
            const scheduler = {
                create: () => scheduler,
                unique: () => scheduler,
                enable: () => scheduler,
                repeatEvery: jest.fn(),
                schedule: jest.fn(),
                save,
                ...agendaJob
            }

            // @ts-ignore
            mockedScheduler.getInstance.mockReturnValueOnce(scheduler)
            mockedJobModel.countDocuments.mockResolvedValueOnce(0)
            save.mockResolvedValueOnce(agendaJob)

            await JobService.createJob(
                user,
                name,
                workflow,
                ScheduleType.ONCE,
                schedule
            )

            expect(scheduler.repeatEvery).not.toHaveBeenCalled()
            expect(scheduler.schedule).toHaveBeenCalledWith(new Date(schedule))
            expect(scheduler.save).toHaveBeenCalled()
            expect(mockedJobModel.findOneAndUpdate).toHaveBeenCalledWith(
                { agendaJob: id },
                {
                    name,
                    workflow,
                    agendaJob: id,
                    owner: user._id,
                    updatedAt: expect.anything()
                },
                { upsert: true, new: true }
            )
        })

        it('should create a repeating job', async () => {
            const user = UserFactory.getSingleRecord()
            const name = faker.random.word()
            const id = faker.random.uuid()
            const workflow = faker.random.uuid()
            const schedule = 'every day'
            const agendaJob = {
                attrs: {
                    _id: id
                }
            }
            const save = jest.fn()
            const scheduler = {
                create: () => scheduler,
                unique: () => scheduler,
                enable: () => scheduler,
                repeatEvery: jest.fn(),
                schedule: jest.fn(),
                save,
                ...agendaJob
            }

            // @ts-ignore
            mockedScheduler.getInstance.mockReturnValueOnce(scheduler)
            mockedJobModel.countDocuments.mockResolvedValueOnce(0)
            save.mockResolvedValueOnce(agendaJob)

            await JobService.createJob(
                user,
                name,
                workflow,
                ScheduleType.INTERVAL,
                schedule
            )

            expect(scheduler.schedule).not.toHaveBeenCalled()
            expect(scheduler.repeatEvery).toHaveBeenCalledWith(schedule, {
                skipImmediate: true
            })
            expect(scheduler.save).toHaveBeenCalled()
            expect(mockedJobModel.findOneAndUpdate).toHaveBeenCalledWith(
                { agendaJob: id },
                {
                    name,
                    workflow,
                    agendaJob: id,
                    owner: user._id,
                    updatedAt: expect.anything()
                },
                { upsert: true, new: true }
            )
        })
    })

    it('should remove a job', async () => {})

    it('should pause a job', async () => {})

    it('should resume a job', async () => {})

    it('should get job logs', async () => {})

    it('should report job results', async () => {})

    it('should check if job name already exists', async () => {})
})
