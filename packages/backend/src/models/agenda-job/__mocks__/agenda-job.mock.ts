import { Types } from 'mongoose'
import faker from 'faker'
import { InstanceFactory } from 'utils/test-utils'
import { AgendaJob } from '..'

export const AgendaJobFactory = new InstanceFactory<AgendaJob>(
    (): AgendaJob => {
        const id = Types.ObjectId()

        // @ts-ignore
        return {
            id: id.toHexString(),
            _id: id,
            name: faker.random.word(),
            data: {
                workflowId: faker.random.uuid()
            },
            type: 'normal',
            priority: 0,
            nextRunAt: new Date(),
            lastModifiedBy: 'localhost',
            lockedAt: new Date(),
            lastFinishedAt: new Date(),
            disabled: false,
            repeatInterval: 'one day',
            repeatTimezone: 'NO',
            lastRunAt: new Date(),
            failReason: '',
            failCount: 0,
            failedAt: new Date()
        }
    }
)
