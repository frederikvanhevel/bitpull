import { Types } from 'mongoose'
import faker from 'faker'
import { InstanceFactory } from 'utils/test-utils'
import { AuthenticationContext } from 'controllers/graphql/directives/auth'
import { User } from '..'

export const UserFactory = new InstanceFactory<User>(
    (): User => {
        const id = Types.ObjectId()

        return {
            id: id.toHexString(),
            _id: id,
            email: faker.internet.email(),
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            verified: false,
            // @ts-ignore
            equals: (otherId: string) => otherId === id.toHexString()
        }
    }
)

export const getMockedContext = (user?: User): AuthenticationContext => {
    return {
        user: user || UserFactory.getSingleRecord()
    }
}
