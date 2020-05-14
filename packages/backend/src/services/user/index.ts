import UserModel, {
    User,
    UserSettings,
    UserDocument,
    OAuthProvider
} from 'models/user'
import { NotFoundError, BadRequestError, EmailInUseError } from 'utils/errors'
import PaymentService from 'services/payment'
import MailService from 'services/mail'
import Google from 'components/integrations/google'
import { PaymentPlan } from 'models/payment'
import Segment, { TrackingEvent } from 'components/segment'
import ReferralService from 'services/referral'
import { LoginResponse } from './typedefs'
import {
    generateLoginToken,
    generateRandomToken,
    getReferralId
} from './helper'

const RESET_PASSWORD_TIME = 3600000 // 1 hour

const login = async (
    email: string,
    password: string
): Promise<LoginResponse> => {
    const { user, error } = await UserModel.authenticate()(email, password)

    if (user.deleted) throw new NotFoundError()

    if (error) throw error

    Segment.track(TrackingEvent.USER_LOGIN, user)
    Segment.identify(user)

    return {
        user,
        token: generateLoginToken(user)
    }
}

const generateAndSendVerificationToken = async (currentUser: User) => {
    const user = await UserModel.findById(currentUser._id)

    if (!user) {
        throw new NotFoundError()
    }

    const verificationToken = await generateRandomToken()
    await user.updateOne({ verificationToken, verified: false })

    MailService.sendVerificationEmail(user, verificationToken)
}

const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    referralId?: string
): Promise<LoginResponse> => {
    const userData = {
        email
    } as UserDocument

    const user = await UserModel.register(userData, password)

    user.firstName = firstName
    user.lastName = lastName

    const payment = await PaymentService.createCustomer(user, PaymentPlan.FREE)

    user.payment = payment._id
    user.referralId = getReferralId(user.id)

    await user.save()

    await generateAndSendVerificationToken(user)

    if (referralId) {
        await ReferralService.addEntry(user, referralId)
    }

    Segment.track(TrackingEvent.USER_REGISTERED, user)
    Segment.identify(user)

    return await login(email, password)
}

const oAuth = async (
    provider: OAuthProvider,
    code: string,
    referralId?: string
): Promise<LoginResponse> => {
    const profile = await Google.getProfile(code)

    let user: any = await UserModel.findOne({
        providerId: profile.id,
        deleted: { $ne: true }
    })

    if (!user) {
        const created = await UserModel.create({
            provider,
            providerId: profile.id,
            email: profile.email,
            verified: profile.verified_email,
            firstName: profile.given_name,
            lastName: profile.family_name,
            picture: profile.picture
        })

        created.referralId = getReferralId(created.id)

        if (referralId) {
            await ReferralService.addEntry(created, referralId)
        }

        const payment = await PaymentService.createSubscription(
            created,
            PaymentPlan.METERED
        )

        created.payment = payment._id

        user = await created.save()

        Segment.track(TrackingEvent.USER_OAUTH_REGISTERED, user)
    } else {
        Segment.track(TrackingEvent.USER_OAUTH_LOGIN, user)
    }

    Segment.identify(user)

    return {
        user,
        token: generateLoginToken(user)
    }
}

const getUser = async (userId: string): Promise<User | null> => {
    return await UserModel.findOne({
        _id: userId,
        deleted: { $ne: true }
    })
}

const forgotPassword = async (email: string) => {
    const token = await generateRandomToken()

    const user = await UserModel.findOneAndUpdate(
        {
            email,
            deleted: { $ne: true }
        },
        {
            resetPasswordToken: token,
            resetPasswordExpires: new Date(Date.now() + RESET_PASSWORD_TIME)
        }
    )

    if (user) {
        Segment.track(TrackingEvent.USER_FORGOT_PASSWORD, user)
        MailService.sendForgotPasswordEmail(email, token)
    }
}

const resetPassword = async (token: string, password: string) => {
    const user = await UserModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: new Date() }
    })

    if (!user) {
        throw new NotFoundError()
    }

    await user.setPassword(password)
    await user.save()
    await user.updateOne({
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
        updatedAt: new Date()
    })

    Segment.track(TrackingEvent.USER_RESET_PASSWORD, user)
}

const updateInformation = async (
    user: User,
    data: Partial<User>
): Promise<User> => {
    const userModel = await UserModel.findById(user._id)

    if (!userModel) {
        throw new NotFoundError()
    }

    const newUser = {
        id: userModel.id,
        ...userModel.toJSON(),
        ...data
    }

    if (data.email && data.email !== userModel.email) {
        const existingUser = await UserModel.findOne({ email: data.email })
        if (existingUser) throw new EmailInUseError()
        await generateAndSendVerificationToken(newUser)
    }

    await userModel.updateOne(data)
    await PaymentService.updateUserInfo(newUser, {
        email: data.email || userModel.email,
        name: `${data.firstName || userModel.firstName} ${
            data.lastName || userModel.lastName
        }`
    })

    Segment.track(TrackingEvent.USER_UPDATE_INFO, newUser)
    Segment.identify(newUser)

    return newUser
}

const verifyEmail = async (token: string) => {
    const user = await UserModel.findOne({
        verificationToken: token
    })

    if (!user || token !== user.verificationToken) {
        throw new BadRequestError()
    }

    Segment.track(TrackingEvent.USER_VERIFY_EMAIL, user)

    await user.updateOne({
        verified: true,
        verificationToken: undefined
    })
}

const cancelAccount = async (user: User) => {
    await UserModel.findByIdAndUpdate(user._id, {
        deleted: true
    })

    Segment.track(TrackingEvent.USER_CANCEL_ACCOUNT, user)

    await PaymentService.changePlan(user, PaymentPlan.METERED)
}

const updateSettings = async (user: User, settings: Partial<UserSettings>) => {
    await UserModel.findByIdAndUpdate(user._id, {
        settings: Object.assign({}, user.settings, settings)
    })

    Segment.track(TrackingEvent.USER_UPDATE_SETTINGS, user)
}

const UserService = {
    login,
    register,
    oAuth,
    getUser,
    forgotPassword,
    resetPassword,
    updateInformation,
    generateAndSendVerificationToken,
    verifyEmail,
    cancelAccount,
    updateSettings
}

export default UserService
