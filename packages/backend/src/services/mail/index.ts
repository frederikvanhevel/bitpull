import UserModel, { User } from 'models/user'
import Email, { Template } from 'components/email'
import PaymentModel from 'models/payment'
import { NotFoundError } from 'utils/errors'
import Config from 'utils/config'

const sendVerificationEmail = (user: User, token: string) => {
    const link = `${Config.APP_URL}/verify?token=${token}`

    Email.send({
        to: user.email,
        template: Template.VERIFY_EMAIL,
        params: {
            link
        }
    })
}

const sendForgotPasswordEmail = (email: string, token: string) => {
    const link = `${Config.APP_URL}/reset-password?token=${token}`

    Email.send({
        to: email,
        template: Template.FORGOT_PASSWORD,
        params: {
            link
        }
    })
}

const sendJobHasErrorsEmail = (email: string, jobName: string) => {
    const link = `${Config.APP_URL}/jobs`

    Email.send({
        to: email,
        template: Template.JOB_HAS_ERRORS,
        params: {
            jobName,
            link
        }
    })
}

const sendPaymentFailedEmail = (email: string) => {
    const link = `${Config.APP_URL}/settings/payment`

    Email.send({
        to: email,
        template: Template.PAYMENT_FAILED,
        params: {
            link
        }
    })
}

const sendTrialWillEndEmail = async (customerId: string) => {
    const payment = await PaymentModel.findOne({ customerId })

    if (!payment) {
        throw new NotFoundError()
    }

    const user = await UserModel.findById(payment.owner)

    if (!user) {
        throw new NotFoundError()
    }

    const link = `${Config.APP_URL}/settings/payment`

    Email.send({
        to: user.email,
        template: Template.TRIAL_WILL_END,
        params: {
            link
        }
    })
}

const sendOutOfCreditsEmail = async (user: User) => {
    const payment = await PaymentModel.findOne({
        owner: user._id
    })

    if (!payment) {
        throw new NotFoundError()
    }

    if (payment.sourceId) return

    const link = `${Config.APP_URL}/settings/payment`

    Email.send({
        to: user.email,
        template: Template.OUT_OF_CREDITS,
        params: {
            link
        }
    })
}

const sendReferralAwardEmail = async (
    user: User,
    referredUser: User,
    credits: number
) => {
    const referralLink = `${Config.APP_URL}/register?ref=${user.referralId}`

    Email.send({
        to: user.email,
        template: Template.REFERRAL_AWARDED,
        params: {
            referredUser: referredUser.firstName,
            credits,
            referralLink
        }
    })
}

const sendFeedbackEmail = (user: User, type: string, question: string) => {
    Email.send({
        to: 'help@bitpull.io',
        from: { name: `${user.firstName} ${user.lastName}`, email: user.email },
        template: Template.FEEDBACK,
        params: {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            type,
            question
        }
    })
}

const MailService = {
    sendVerificationEmail,
    sendForgotPasswordEmail,
    sendJobHasErrorsEmail,
    sendPaymentFailedEmail,
    sendTrialWillEndEmail,
    sendOutOfCreditsEmail,
    sendReferralAwardEmail,
    sendFeedbackEmail
}

export default MailService
