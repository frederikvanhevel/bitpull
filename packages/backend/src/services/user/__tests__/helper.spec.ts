import { getReferralId } from '../helper'

describe('User service helper', () => {
    it('should generate a referral id', async () => {
        const userId = '5e96d99947e4120d09bc1f4b'
        const referralId = getReferralId(userId)

        expect(referralId).toEqual('c1f4b')
    })
})
