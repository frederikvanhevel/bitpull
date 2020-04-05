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
import Growwsurf from 'components/growsurf'
import Logger from 'utils/logging/logger'
import { PaymentPlan } from 'models/payment'
import { LoginResponse } from './typedefs'
import { generateLoginToken, generateRandomToken } from './helper'

const RESET_PASSWORD_TIME = 3600000 // 1 hour

const login = async (
    email: string,
    password: string
): Promise<LoginResponse> => {
    const { user, error } = await UserModel.authenticate()(email, password)

    if (user.deleted) throw new NotFoundError()

    if (error) throw error

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
    await user.update({ verificationToken, verified: false })

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

    const payment = await PaymentService.createSubscription(
        user,
        PaymentPlan.METERED
    )

    user.payment = payment._id

    await user.save()

    await generateAndSendVerificationToken(user)

    try {
        await Growwsurf.addParticipant(user, referralId)
    } catch (error) {
        Logger.error(new Error('Could not add user to Growsurf'), error, user)
    }

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

        try {
            await Growwsurf.addParticipant(created, referralId)
        } catch (error) {
            Logger.error(
                new Error('Could not add user to Growsurf'),
                error,
                user
            )
        }

        const payment = await PaymentService.createSubscription(
            created,
            PaymentPlan.METERED
        )

        created.payment = payment._id

        user = await created.save()
    }

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
            resetPasswordExpires: Date.now() + RESET_PASSWORD_TIME
        }
    )

    user && MailService.sendForgotPasswordEmail(email, token)
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
    await user.update({
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
        updatedAt: new Date()
    })
}

const updateInformation = async (
    user: User,
    data: Partial<User>
): Promise<User> => {
    const userModel = await UserModel.findById(user._id)

    if (!userModel) {
        throw new NotFoundError()
    }

    if (data.email && data.email !== userModel.email) {
        const existingUser = await UserModel.findOne({ email: data.email })
        if (existingUser) throw new EmailInUseError()
        await generateAndSendVerificationToken(userModel)
    }

    await userModel.updateOne(data)
    await PaymentService.updateUserInfo(userModel, {
        email: data.email || userModel.email,
        name: `${data.firstName || userModel.firstName} ${
            data.lastName || userModel.lastName
        }`
    })

    try {
        await Growwsurf.updateParticipant(userModel.email, data)
    } catch (error) {
        Logger.error(
            new Error('Could not update Growsurf participant'),
            error,
            userModel
        )
    }

    return {
        ...userModel.toJSON(),
        ...data
    }
}

const verifyEmail = async (token: string) => {
    const user = await UserModel.findOne({
        verificationToken: token
    })

    if (!user || token !== user.verificationToken) {
        throw new BadRequestError()
    }

    await user.update({
        verified: true,
        verificationToken: undefined
    })
}

const getReferralLink = async (user: User) => {
    const participant = await Growwsurf.getParticipant(user)

    if (!participant) {
        throw new NotFoundError()
    }

    return participant.shareUrl
}

const cancelAccount = async (user: User) => {
    await UserModel.findByIdAndUpdate(user._id, {
        deleted: true
    })

    await PaymentService.changePlan(user, PaymentPlan.METERED)
}

const updateSettings = async (user: User, settings: Partial<UserSettings>) => {
    await UserModel.findByIdAndUpdate(user._id, {
        settings: Object.assign({}, user.settings, settings)
    })
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
    getReferralLink,
    cancelAccount,
    updateSettings
}

export default UserService
