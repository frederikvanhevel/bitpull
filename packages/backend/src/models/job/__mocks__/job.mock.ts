import { Types } from 'mongoose'
import faker from 'faker'
import { InstanceFactory } from 'utils/test-utils'
import { WorkflowFactory } from 'models/workflow/__mocks__/workflow.mock'
import { UserFactory } from 'models/user/__mocks__/user.mock'
import { AgendaJobFactory } from 'models/agenda-job/__mocks__/agenda-job.mock'
import { Job } from '..'

export const JobFactory = new InstanceFactory<Job>(
    (): Job => {
        const id = Types.ObjectId()

        return {
            id: id.toHexString(),
            _id: id,
            name: faker.random.words(),
            workflow: WorkflowFactory.getSingleRecord(),
            hasErrors: false,
            owner: UserFactory.getSingleRecord(),
            agendaJob: AgendaJobFactory.getSingleRecord(),
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }
)
