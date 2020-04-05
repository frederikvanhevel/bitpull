import { Types } from 'mongoose'
import faker from 'faker'
import { InstanceFactory } from 'utils/test-utils'
import { UserFactory } from 'models/user/__mocks__/user.mock'
import { NodeType } from '@bitpull/worker'
import { Workflow } from '..'

export const WorkflowFactory = new InstanceFactory<Workflow>(
    (): Workflow => {
        const id = Types.ObjectId()

        return {
            id: id.toHexString(),
            _id: id,
            name: faker.random.words(),
            owner: UserFactory.getSingleRecord(),
            node: {
                id: faker.random.uuid(),
                type: NodeType.HTML
            }
        }
    }
)
