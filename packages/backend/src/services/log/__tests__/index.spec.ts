import { mocked } from 'ts-jest/utils'
import LogModel from 'models/log'
import { ParseResult, Status } from '@bitpull/worker'
import LogService from '..'

jest.mock('models/log')
const mockedLogModel = mocked(LogModel)

describe('Log service', () => {
    it('should save job logs', async () => {
        const parseResult: ParseResult = {
            status: Status.SUCCESS,
            errors: [],
            logs: [],
            files: []
        }

        await LogService.saveJobLog('jobId', 'workflowId', parseResult)

        expect(mockedLogModel.findOneAndUpdate).toHaveBeenCalledWith(
            {
                job: 'jobId'
            },
            {
                status: parseResult.status,
                logs: parseResult.logs,
                errors: parseResult.errors,
                workflow: 'workflowId'
            },
            { upsert: true }
        )
    })
})
