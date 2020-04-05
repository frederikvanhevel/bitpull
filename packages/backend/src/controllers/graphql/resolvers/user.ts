import { GraphQLFieldResolver } from 'graphql'
import { User } from 'models/user'
import UserService from 'services/user'
import {
    MutationRegisterArgs,
    MutationLoginArgs,
    MutationForgotPasswordArgs,
    MutationVerifyEmailArgs,
    MutationResetPasswordArgs,
    MutationUpdateInformationArgs
} from 'typedefs/graphql'
import { LoginResponse } from 'services/user/typedefs'
import Logger from 'utils/logging/logger'
import { AuthenticationContext } from '../directives/auth'

export const getCurrentUser: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context): Promise<User | null> => {
    try {
        return context.user
    } catch (error) {
        Logger.throw(
            new Error('Could not get current user'),
            error,
            context.user
        )
    }
}

export const getReferralLink: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context): Promise<string> => {
    try {
        return await UserService.getReferralLink(context.user)
    } catch (error) {
        Logger.throw(
            new Error('Could not get referral link'),
            error,
            context.user
        )
    }
}

export const register: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    MutationRegisterArgs
> = async (root, args): Promise<LoginResponse> => {
    try {
        const { data } = args
        return await UserService.register(
            data.email,
            data.password,
            data.firstName,
            data.lastName,
            data.referralId || undefined
        )
    } catch (error) {
        Logger.error(new Error('Could not register user'), error)
        throw error
    }
}

export const oAuth: GraphQLFieldResolver<any, AuthenticationContext> = async (
    root,
    args
): Promise<LoginResponse> => {
    try {
        const { data } = args
        return await UserService.oAuth(
            data.provider,
            data.code,
            data.referralId
        )
    } catch (error) {
        Logger.throw(new Error('Could not register user with google'), error)
    }
}

export const login: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    MutationLoginArgs
> = async (root, args): Promise<LoginResponse> => {
    try {
        const { data } = args
        return await UserService.login(data.email, data.password)
    } catch (error) {
        Logger.error(new Error('Could not login user'), error)
        throw error
    }
}

export const forgotPassword: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    MutationForgotPasswordArgs
> = async (root, args) => {
    try {
        await UserService.forgotPassword(args.email)
        return true
    } catch (error) {
        Logger.error(
            new Error(`Reset password request failed for ${args.email}`),
            error
        )
    }
}

export const resetPassword: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    MutationResetPasswordArgs
> = async (root, args) => {
    try {
        await UserService.resetPassword(args.token, args.password)
        return true
    } catch (error) {
        Logger.throw(new Error('Could not reset password'), error)
    }
}

export const sendVerificationEmail: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context) => {
    const { user } = context
    try {
        if (user.verified) return true
        await UserService.generateAndSendVerificationToken(user)
        return true
    } catch (error) {
        Logger.throw(
            new Error('Could not send verification email'),
            error,
            context.user
        )
    }
}

export const verifyEmail: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    MutationVerifyEmailArgs
> = async (root, args) => {
    try {
        await UserService.verifyEmail(args.token)
        return true
    } catch (error) {
        Logger.throw(new Error('Could not verify email'), error)
    }
}

export const updateInformation: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    MutationUpdateInformationArgs
> = async (root, args, context) => {
    try {
        return await UserService.updateInformation(
            context.user,
            args.data as Partial<User>
        )
    } catch (error) {
        Logger.throw(
            new Error('Could not update user info'),
            error,
            context.user
        )
    }
}

export const cancelAccount: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context) => {
    try {
        await UserService.cancelAccount(context.user)
        return true
    } catch (error) {
        Logger.throw(new Error('Could not cancel account'), error, context.user)
    }
}

export const updateSettings: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context) => {
    try {
        await UserService.updateSettings(context.user, args.settings)
        return true
    } catch (error) {
        Logger.throw(
            new Error('Could not update settings'),
            error,
            context.user
        )
    }
}
