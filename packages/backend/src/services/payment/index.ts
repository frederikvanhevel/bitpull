// import isFuture from 'date-fns/isFuture'
import Stripe from 'components/stripe'
import PaymentModel, {
    REFERRED_CREDIT_AMOUNT,
    MAX_REFERRED_CREDITS,
    PaymentPlan
} from 'models/payment'
import { Token } from 'typedefs/graphql'
import { NotFoundError } from 'utils/errors'
import UserModel, { User, UserDocument } from 'models/user'
import MailService from 'services/mail'
import Growwsurf from 'components/growsurf'

const getDetails = async (user: User) => {
    return await PaymentModel.findOne({ owner: user._id })
        .select({
            _id: 0,
            plan: 1,
            sourceLast4: 1,
            sourceBrand: 1,
            trialEndsAt: 1,
            disabled: 1,
            credits: 1,
            earnedCredits: 1
        })
        .lean()
}

const createSubscription = async (user: User, plan: PaymentPlan) => {
    const { id, email, firstName, lastName } = user

    const details = await Stripe.createCustomer(
        email,
        `${firstName} ${lastName}`,
        plan
    )

    const payment = new PaymentModel({
        ...details,
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

const reportUsage = async (user: User, seconds: number) => {
    const payment = await PaymentModel.findOne({
        owner: user._id
    })

    if (!payment) {
        throw new NotFoundError()
    }

    if (payment.plan !== PaymentPlan.METERED) return

    let secondsToReport = 0

    if (payment.credits > 0) {
        const diff = payment.credits - seconds

        if (diff < 0) {
            payment.credits = 0
            secondsToReport = Math.abs(diff)

            await MailService.sendOutOfFreeCreditsEmail(user)
        } else {
            payment.credits = diff
        }

        await payment.save()
    } else {
        secondsToReport = seconds
    }

    if (secondsToReport > 0) {
        await Stripe.reportUsage(payment.meteredPlanId, secondsToReport)
    }
}

const hasPaymentMethod = async (userId: string | UserDocument['_id']) => {
    const payment = await PaymentModel.findOne({
        owner: userId
    }).lean()

    if (!payment || payment.disabled) return false

    return !!payment.sourceId || payment.credits > 0
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
        await Growwsurf.triggerReferral(user)
    }

    payment.sourceId = token.id
    payment.sourceBrand = token.card.brand
    payment.sourceLast4 = token.card.last4

    await payment.save()
}

const disable = async (stripeCustomerId: string) => {
    const payment = await PaymentModel.findOne({
        customerId: stripeCustomerId
    })

    if (!payment) {
        throw new NotFoundError()
    }

    payment.disabled = true

    await payment.save()

    const user = await UserModel.findById(payment.owner).lean()

    if (!user) {
        throw new NotFoundError()
    }

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

    return await Stripe.getUsageSummary(payment.meteredPlanId)
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

    const planId = await Stripe.changePlan(payment, plan)

    payment.plan = plan
    payment.recurringPlanId = planId

    await payment.save()
}

const PaymentService = {
    getDetails,
    updateUserInfo,
    createSubscription,
    reportUsage,
    hasPaymentMethod,
    updatePayment,
    disable,
    getInvoices,
    getUsageSummary,
    addReferralCredits,
    changePlan
}

export default PaymentService
