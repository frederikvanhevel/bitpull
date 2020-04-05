import { GraphQLFieldResolver } from 'graphql'
import { TokenInput } from 'typedefs/graphql'
import PaymentService from 'services/payment'
import Logger from 'utils/logging/logger'
import { AuthenticationContext } from '../directives/auth'

export const hasPaymentMethod: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context) => {
    try {
        return await PaymentService.hasPaymentMethod(context.user.id)
    } catch (error) {
        Logger.throw(
            new Error('Could not check has payment method'),
            error,
            context.user
        )
    }
}

export const updatePayment: GraphQLFieldResolver<
    any,
    AuthenticationContext,
    { input: TokenInput }
> = async (root, args, context) => {
    try {
        await PaymentService.updatePayment(context.user, args.input.token)
        return true
    } catch (error) {
        Logger.throw(
            new Error('Could not update payment data'),
            error,
            context.user
        )
    }
}

export const getPaymentDetails: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context) => {
    try {
        return await PaymentService.getDetails(context.user)
    } catch (error) {
        Logger.throw(
            new Error('Could not get payment details'),
            error,
            context.user
        )
    }
}

export const getInvoices: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context) => {
    try {
        return await PaymentService.getInvoices(context.user)
    } catch (error) {
        Logger.throw(new Error('Could not get invoices'), error, context.user)
    }
}

export const getUsageSummary: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context) => {
    try {
        return await PaymentService.getUsageSummary(context.user)
    } catch (error) {
        Logger.throw(
            new Error('Could not get usage summary'),
            error,
            context.user
        )
    }
}

export const changePlan: GraphQLFieldResolver<
    any,
    AuthenticationContext
> = async (root, args, context) => {
    try {
        await PaymentService.changePlan(context.user, args.plan)
        return true
    } catch (error) {
        Logger.throw(new Error('Could not change plan'), error, context.user)
    }
}
