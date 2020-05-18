import Stripe from 'components/stripe'
import PaymentModel, {
    REFERRED_CREDIT_AMOUNT,
    MAX_REFERRED_CREDITS,
    PaymentPlan,
    PLAN_CREDIT_AMOUNT
} from 'models/payment'
import { Token } from 'typedefs/graphql'
import { NotFoundError } from 'utils/errors'
import UserModel, { User, UserDocument } from 'models/user'
import MailService from 'services/mail'
import Segment, { TrackingEvent } from 'components/segment'
import ReferralService from 'services/referral'
import { Stats } from '@bitpull/worker'
import Logger from 'utils/logging/logger'

const getDetails = async (user: User) => {
    return await PaymentModel.findOne({ owner: user._id })
        .select({
            _id: 0,
            plan: 1,
            sourceLast4: 1,
            sourceBrand: 1,
            trialEndsAt: 1,
            credits: 1,
            earnedCredits: 1
        })
        .lean()
}

const createCustomer = async (user: User, plan: PaymentPlan) => {
    const { id, email, firstName, lastName } = user

    const customerId = await Stripe.createCustomer(
        email,
        `${firstName} ${lastName}`
    )

    const details = await Stripe.createSubscription(customerId, plan)

    const payment = new PaymentModel({
        ...details,
        customerId,
        plan,
        owner: id
    })

    return await payment.save()
}

const updateUserInfo = async (
    user: User,
    data: { email?: string; name?: string }
) => {
    const payment = await PaymentModel.findOne({
        owner: user._id
    }).lean()

    if (!payment) {
        throw new NotFoundError()
    }

    await Stripe.updateCustomer(payment.customerId, data)
}

const reportUsage = async (user: User, stats: Stats) => {
    const payment = await PaymentModel.findOne({
        owner: user._id
    })

    if (!payment) {
        throw new NotFoundError()
    }

    let pagesToReport = 0

    if (payment.credits > 0) {
        const diff = payment.credits - stats.pageCount

        if (diff < 0) {
            payment.credits = 0
            pagesToReport = Math.abs(diff)

            await MailService.sendOutOfCreditsEmail(user)
        } else {
            payment.credits = diff
        }

        await payment.save()
    } else {
        pagesToReport = stats.pageCount
    }

    if (pagesToReport > 0 && payment.plan === PaymentPlan.METERED) {
        await Stripe.reportUsage(payment.planId, pagesToReport)
    }

    Logger.info(`Billed user ${user.id} for ${stats.pageCount} pages`)
}

const hasCreditsRemaining = async (userId: string | UserDocument['_id']) => {
    const payment = await PaymentModel.findOne({
        owner: userId
    }).lean()

    if (!payment) return false

    if (payment.plan === PaymentPlan.METERED) return true

    return payment.credits > 0
}

const updatePayment = async (user: User, token: Token) => {
    const payment = await PaymentModel.findOne({
        owner: user._id
    })

    if (!payment) {
        throw new NotFoundError()
    }

    await Stripe.setCardToken(payment.toJSON().customerId, token.id)

    // card added for first time
    if (!payment.sourceId) {
        // TODO check fingerprint of card to make sure it wasnt already added to another user
        await ReferralService.award(user)
    }

    payment.sourceId = token.id
    payment.sourceBrand = token.card.brand
    payment.sourceLast4 = token.card.last4

    Segment.track(TrackingEvent.PAYMENT_UPDATE, user)

    await payment.save()
}

const disable = async (stripeCustomerId: string) => {
    const payment = await PaymentModel.findOne({
        customerId: stripeCustomerId
    })

    if (!payment) {
        throw new NotFoundError()
    }

    if (
        payment.plan !== PaymentPlan.FREE &&
        payment.plan !== PaymentPlan.METERED
    ) {
        payment.credits = 0
    }

    await payment.save()

    const user = await UserModel.findById(payment.owner)

    if (!user) {
        throw new NotFoundError()
    }

    Segment.track(TrackingEvent.PAYMENT_DISABLED, user)

    MailService.sendPaymentFailedEmail(user.email)
}

const getInvoices = async (user: User) => {
    const payment = await PaymentModel.findOne({
        owner: user._id
    }).lean()

    if (!payment) {
        throw new NotFoundError()
    }

    return await Stripe.getInvoices(payment.customerId)
}

const getUsageSummary = async (user: User) => {
    const payment = await PaymentModel.findOne({
        owner: user._id
    }).lean()

    if (!payment) {
        throw new NotFoundError()
    }

    if (payment.plan !== PaymentPlan.METERED) return

    return await Stripe.getUsageSummary(payment.planId)
}

const addReferralCredits = async (user: User) => {
    const payment = await PaymentModel.findOne({
        owner: user._id
    })

    if (!payment) {
        throw new NotFoundError()
    }

    if (payment.earnedCredits + REFERRED_CREDIT_AMOUNT > MAX_REFERRED_CREDITS) {
        const diff = MAX_REFERRED_CREDITS - payment.earnedCredits
        payment.earnedCredits = MAX_REFERRED_CREDITS
        payment.credits += diff
    } else {
        payment.earnedCredits += REFERRED_CREDIT_AMOUNT
        payment.credits += REFERRED_CREDIT_AMOUNT
    }

    Segment.track(TrackingEvent.PAYMENT_ADD_REFERRAL_CREDITS, user, {
        properties: {
            newCredits: payment.credits,
            totalEarned: payment.earnedCredits
        }
    })

    await payment.save()
}

const changePlan = async (user: User, plan: PaymentPlan) => {
    const payment = await PaymentModel.findOne({
        owner: user._id
    })

    if (!payment) {
        throw new NotFoundError()
    }

    if (payment.plan === plan) return

    if (plan !== PaymentPlan.FREE && !payment.sourceId) {
        throw new Error('User has no payment card')
    }

    if (payment.plan === PaymentPlan.METERED || plan === PaymentPlan.METERED) {
        await Stripe.removeSubscription(payment.subscriptionId)
        const { subscriptionId, planId } = await Stripe.createSubscription(
            payment.customerId,
            plan
        )

        payment.subscriptionId = subscriptionId
        payment.planId = planId
    } else {
        await Stripe.changePlan(payment, plan)
    }

    payment.plan = plan

    if (plan !== PaymentPlan.FREE && plan !== PaymentPlan.METERED) {
        payment.credits = PLAN_CREDIT_AMOUNT[plan]
    }

    Segment.track(TrackingEvent.PAYMENT_CHANGE_PLAN, user, {
        properties: {
            plan
        }
    })

    await payment.save()
}

const refillCredits = async (stripeCustomerId: string) => {
    const payment = await PaymentModel.findOne({
        customerId: stripeCustomerId
    })

    if (!payment) {
        throw new NotFoundError()
    }

    if (payment.plan === PaymentPlan.METERED) return

    payment.credits = PLAN_CREDIT_AMOUNT[payment.plan]

    await payment.save()

    const user = await UserModel.findById(payment.owner)

    if (!user) {
        throw new NotFoundError()
    }

    Segment.track(TrackingEvent.PAYMENT_CREDITS_REFILLED, user)
}

const getUserByCustomerId = async (stripeCustomerId: string) => {
    const payment = await PaymentModel.findOne({
        customerId: stripeCustomerId
    })

    if (!payment) {
        throw new NotFoundError()
    }

    const user = await UserModel.findById(payment.owner)

    if (!user) {
        throw new NotFoundError()
    }

    return user
}

const PaymentService = {
    getDetails,
    updateUserInfo,
    createCustomer,
    reportUsage,
    hasCreditsRemaining,
    updatePayment,
    disable,
    getInvoices,
    getUsageSummary,
    addReferralCredits,
    changePlan,
    refillCredits,
    getUserByCustomerId
}

export default PaymentService
