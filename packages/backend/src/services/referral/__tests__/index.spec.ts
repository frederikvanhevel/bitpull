import { mocked } from 'ts-jest/utils'
import { UserFactory } from 'models/user/__mocks__/user.mock'
import { ReferralFactory } from 'models/referral/__mocks__/referral.mock'
import UserModel, { UserDocument } from 'models/user'
import ReferralModel, { ReferralDocument } from 'models/referral'
import PaymentService from 'services/payment'
import ReferralService from '..'

jest.mock('models/referral')
const mockedReferralModel = mocked(ReferralModel)

jest.mock('models/user')
const mockedUserModel = mocked(UserModel)

jest.mock('services/payment')
const mockePaymentService = mocked(PaymentService)

describe('Referral service', () => {
    it('should save a referral entry', async () => {
        const referrer = UserFactory.getSingleRecord()
        const referree = UserFactory.getSingleRecord({
            referralId: '12345'
        })

        mockedUserModel.findOne.mockResolvedValueOnce(referrer as UserDocument)

        await ReferralService.addEntry(referree, referree.referralId)

        expect(mockedReferralModel).toHaveBeenCalledWith({
            referrer: referrer.id,
            referree: referree.id,
            status: 'PENDING'
        })
        // @ts-ignore
        expect(mockedReferralModel.prototype.save).toHaveBeenCalled()
    })

    it('should award the referrer', async () => {
        const referrer = UserFactory.getSingleRecord()
        const referral = ReferralFactory.getSingleRecord()
        const returnedReferral = {
            ...(referral as ReferralDocument),
            remove: jest.fn()
        }

        // @ts-ignore
        mockedReferralModel.findOne.mockReturnValueOnce(returnedReferral)
        mockedUserModel.findById.mockResolvedValue(referrer as UserDocument)

        await ReferralService.award(referrer)

        expect(mockePaymentService.addReferralCredits).toHaveBeenCalledWith(
            referrer
        )
        expect(returnedReferral.remove).toHaveBeenCalled()
    })
})
