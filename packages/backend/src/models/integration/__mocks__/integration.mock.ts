import { Types } from 'mongoose'
import { InstanceFactory } from 'utils/test-utils'
import { IntegrationType } from '@bitpull/worker'
import { UserFactory } from 'models/user/__mocks__/user.mock'
import { Integration } from '..'

export const IntegrationFactory = new InstanceFactory<Integration>(
    (): Integration => {
        const id = Types.ObjectId()

        // @ts-ignore
        return {
            id: id.toHexString(),
            _id: id,
            type: IntegrationType.DROPBOX,
            active: true,
            settings: {},
            owner: UserFactory.getSingleRecord(),
            save: jest.fn(),
            remove: jest.fn()
        }
    }
)
