import ReferralModel, { ReferralStatus } from 'models/referral'
import UserModel, { User } from 'models/user'
import PaymentService from 'services/payment'

const addEntry = async (user: User, referralId: string) => {
    const referrer = await UserModel.findOne({ referralId })

    if (!referrer) return

    const entry = new ReferralModel({
        referrer: referrer.id,
        referree: user.id,
        status: ReferralStatus.PENDING
    })

    await entry.save()
}

const award = async (user: User) => {
    const entry = await ReferralModel.findOne({ referree: user.id })

    if (!entry) return

    const referrer = await UserModel.findById(entry.referrer)

    if (!referrer) return

    await PaymentService.addReferralCredits(referrer)

    await entry.remove()
}

const ReferralService = {
    addEntry,
    award
}

export default ReferralService
