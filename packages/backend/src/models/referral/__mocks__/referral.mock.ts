import { Types } from 'mongoose'
import { InstanceFactory } from 'utils/test-utils'
import { ReferralStatus, Referral } from '..'

export const ReferralFactory = new InstanceFactory<Referral>(
    (): Referral => {
        return {
            referrer: Types.ObjectId().toHexString(),
            referree: Types.ObjectId().toHexString(),
            status: ReferralStatus.PENDING
        }
    }
)
