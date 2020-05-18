import { Types } from 'mongoose'
import faker from 'faker'
import { InstanceFactory } from 'utils/test-utils'
import { UserFactory } from 'models/user/__mocks__/user.mock'
import { Payment, PaymentPlan } from '..'

export const PaymentFactory = new InstanceFactory<Payment>(
    (): Payment => {
        const id = Types.ObjectId()

        return {
            id: id.toHexString(),
            _id: id,
            owner: UserFactory.getSingleRecord(),
            plan: PaymentPlan.FREE,
            customerId: faker.random.uuid(),
            subscriptionId: faker.random.uuid(),
            sourceId: faker.random.uuid(),
            sourceLast4: faker.random.alphaNumeric(4),
            sourceBrand: faker.random.word(),
            credits: 0,
            earnedCredits: 0,
            planId: faker.random.uuid()
        }
    }
)
